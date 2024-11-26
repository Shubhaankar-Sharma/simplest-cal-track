// types/api.ts

export interface Meal {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  name: string;
}

export interface UserProfile {
  age: number;
  sex: string;
  weight: number;
  height: number;
  ethnicity: string;
  goal: string;
  activity_level: string;
}

export interface CalorieReq {
  prompt: string;
}

export interface CalorieResp {
  meals: Meal[];
}

export interface AnalysisReq {
  meals: Meal[];
  user_profile: UserProfile;
}

export interface AnalysisResp {
  response: string;
}

export interface MealQueryOutput {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  name: string;
}

export interface FullMealQueryOutput {
  meals: MealQueryOutput[];
}
