import { UserProfile, Meal } from '../services/apiService';

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getUserProfile(): UserProfile | null {
  return getFromStorage<UserProfile | null>('userProfile', null);
}

export function setUserProfile(profile: UserProfile): void {
  const updatedProfile = {
    ...profile,
    activity_level: profile.activity_level || '',
  };
  setToStorage('userProfile', updatedProfile);
}

export function getMeals(): Record<string, Meal[]> {
  return getFromStorage<Record<string, Meal[]>>('meals', {});
}

export function setMeals(meals: Record<string, Meal[]>): void {
  setToStorage('meals', meals);
}

export function addMeal(date: string, meal: Meal): void {
  const meals = getMeals();
  if (!meals[date]) {
    meals[date] = [];
  }
  meals[date].unshift(meal);
  setMeals(meals);
}

export function updateMeal(date: string, index: number, updatedMeal: Meal): void {
  const meals = getMeals();
  if (meals[date] && meals[date][index]) {
    meals[date][index] = updatedMeal;
    setMeals(meals);
  }
}

export function removeMeal(date: string, index: number): void {
  const meals = getMeals();
  if (meals[date]) {
    meals[date].splice(index, 1);
    setMeals(meals);
  }
}

