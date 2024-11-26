from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_anthropic import ChatAnthropic
from fastapi.middleware.cors import CORSMiddleware

load_dotenv("../.env")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MealQueryOutput(BaseModel):
    calories: int = Field(description="The number of calories in the meal")
    protein: int = Field(description="The number of grams of protein in the meal")
    fat: int = Field(description="The number of grams of fat in the meal")
    carbs: int = Field(description="The number of grams of carbohydrates in the meal")
    fiber: int = Field(description="The number of grams of fiber in the meal")
    name: str = Field(description="The name of the meal")

class FullMealQueryOutput(BaseModel):
    meals: List[MealQueryOutput] = Field(description="The list of meals")

mealtemplate = ChatPromptTemplate.from_messages([
    ("human", """You are tasked with generating a list of meals the user ate for calorie intake analysis based on this: {prompt}.
     When generating meals, follow these guidelines:
        - Ensure that the nutritional values (calories, protein, fat, carbs, fiber) are realistic and appropriate for each meal
        - Provide a descriptive name for each meal
     
     Return the meals in the following format:
     {format_instructions}
    """)
])

mealparser = PydanticOutputParser(pydantic_object=FullMealQueryOutput)

llm = ChatAnthropic(
    model="claude-3-5-sonnet-20241022",
    temperature=0,
    max_tokens=1000,
)

class Meal(BaseModel):
    calories: int
    protein: int
    fat: int
    carbs: int
    fiber: int
    name: str


class UserProfile(BaseModel):
    age: int
    sex: str
    weight: float
    height: float
    ethnicity: str
    goal: str
    activity_level: str

class CalorieReq(BaseModel):
    prompt: str

class CalorieResp(BaseModel):
    meals: List[Meal]


def get_claude_calories(prompt: str) -> List[Meal]:
    messages = mealtemplate.format_messages(
        prompt=prompt,
        format_instructions=mealparser.get_format_instructions()
    )

    response = llm.invoke(messages)
    parsed_response = mealparser.invoke(response)
    meals = []
    for meal in parsed_response.meals:
        meals.append(Meal(**meal.dict()))
    
    return meals

@app.post("/cal")
def get_calories(CalorieReq: CalorieReq):
    prompt = CalorieReq.prompt
    return CalorieResp(meals=get_claude_calories(prompt))


class AnalysisReq(BaseModel):
    meals: List[Meal]
    user_profile: UserProfile

class AnalysisResp(BaseModel):
    response: str

class AnalysisOutput(BaseModel):
    response: str = Field(description="Analysis of the user's meal intake on the basis of the user's profile")

analysistemplate = ChatPromptTemplate.from_messages([
    ("system", "You are the world's leading nutritionist. You are tasked with analyzing the user's day's meals based on their profile which includes their age ethnicity sex goal weight and height."),
    ("human", """The user ate the following meals: {meals}.
     The user's profile is as follows:
        - Age: {age}
        - sex: {sex}
        - weight: {weight} kg
        - height: {height} cm
        - ethnicity: {ethnicity}
        - goal: {goal}
        - activity level: {activity_level}
     
        Provide an analysis of the user's today's meal intake based on their profile.
        Return the analysis in the following format:
        {format_instructions}
    """)
])
analysisparser = PydanticOutputParser(pydantic_object=AnalysisOutput)

def get_llm_analysis(meals: List[Meal], user_profile: UserProfile) -> str:
    messages = analysistemplate.format_messages(
        meals=meals,
        age=user_profile.age,
        sex=user_profile.sex,
        weight=user_profile.weight,
        height=user_profile.height,
        ethnicity=user_profile.ethnicity,
        goal=user_profile.goal,
        activity_level=user_profile.activity_level,
        format_instructions=analysisparser.get_format_instructions()
    )

    response = llm.invoke(messages)
    parsed_response = analysisparser.invoke(response)
    return parsed_response.response

@app.post("/analysis")
def get_analysis(meals: List[Meal], user_profile: UserProfile):
    return {"response": get_llm_analysis(meals, user_profile)}
