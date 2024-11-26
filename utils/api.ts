// utils/api.ts
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from 'zod';
import { Meal, UserProfile } from '@/types/api';

const llm = new ChatAnthropic({
  modelName: "claude-3-5-sonnet-20241022",
  temperature: 0,
  maxTokens: 1000,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

// Define the meal schema using Zod
const mealSchema = z.object({
  meals: z.array(
    z.object({
      calories: z.number().describe("The number of calories in the meal"),
      protein: z.number().describe("The number of grams of protein in the meal"),
      fat: z.number().describe("The number of grams of fat in the meal"),
      carbs: z.number().describe("The number of grams of carbohydrates in the meal"),
      fiber: z.number().describe("The number of grams of fiber in the meal"),
      name: z.string().describe("The name of the meal")
    })
  ).describe("List of meals with their nutritional information")
});

const mealParser = StructuredOutputParser.fromZodSchema(mealSchema);

const mealTemplate = ChatPromptTemplate.fromTemplate(`You are tasked with generating a list of meals the user ate for calorie intake analysis based on this: {prompt}.
When generating meals, follow these guidelines:
  - Ensure that the nutritional values (calories, protein, fat, carbs, fiber) are realistic and appropriate for each meal
  - Provide a descriptive name for each meal

{format_instructions}`);

const mealChain = RunnableSequence.from([
  mealTemplate,
  llm,
  mealParser
]);

export async function getClaudeCalories(prompt: string): Promise<Meal[]> {
  const response = await mealChain.invoke({
    prompt,
    format_instructions: mealParser.getFormatInstructions()
  });
  
  return response.meals;
}

// Define the analysis schema using Zod
const analysisSchema = z.object({
  analysis: z.string().describe("Detailed nutritional analysis based on user profile and meals")
});

const analysisParser = StructuredOutputParser.fromZodSchema(analysisSchema);

const analysisTemplate = ChatPromptTemplate.fromTemplate(`You are the world's leading nutritionist. You are tasked with analyzing the user's day's meals based on their profile.

The user ate the following meals: {meals}.

The user's profile is as follows:
  - Age: {age}
  - sex: {sex}
  - weight: {weight} kg
  - height: {height} cm
  - ethnicity: {ethnicity}
  - goal: {goal}
  - activity level: {activity_level}

Provide an analysis of the user's today's meal intake based on their profile.

{format_instructions}`);

const analysisChain = RunnableSequence.from([
  analysisTemplate,
  llm,
  analysisParser
]);

export async function getLLMAnalysis(meals: Meal[], userProfile: UserProfile): Promise<string> {
  const response = await analysisChain.invoke({
    meals: JSON.stringify(meals),
    ...userProfile,
    format_instructions: analysisParser.getFormatInstructions()
  });
  
  return response.analysis;
}