export interface MealInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

export async function estimateMealInfo(mealDescription: string): Promise<MealInfo> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random values for demonstration
  return {
    calories: Math.floor(Math.random() * 500) + 100,
    protein: Math.floor(Math.random() * 30) + 5,
    fat: Math.floor(Math.random() * 20) + 5,
    carbs: Math.floor(Math.random() * 50) + 10,
    fiber: Math.floor(Math.random() * 10) + 1,
  };
}

export function getSuggestion(currentCalories: number, calorieLimit: number): string {
  const difference = calorieLimit - currentCalories;
  if (difference > 300) {
    return "You're well under your calorie limit. Consider adding more nutrient-dense foods to your diet.";
  } else if (difference < -300) {
    return "You've exceeded your calorie limit. Try to incorporate more low-calorie, high-volume foods in your next meals.";
  } else {
    return "You're on track with your calorie goal. Keep up the balanced diet!";
  }
}

