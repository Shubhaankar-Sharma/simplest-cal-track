'use client'

import { useState, useEffect } from 'react'
import { getFromStorage, setToStorage, getUserProfile, setUserProfile, getMeals, addMeal, updateMeal, removeMeal } from '../utils/storage'
import apiService, { Meal, UserProfile } from '../services/apiService'
import CalorieLimitSetting from '@/components/CalorieLimitSetting'
import MealInput from '@/components/MealInput'
import MealList from '@/components/MealList'
import Summary from '@/components/Summary'
import UserProfileForm from '@/components/UserProfileForm'
import DateSelector from '@/components/DateSelector'
import CalorieBubble from '@/components/CalorieBubble'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export default function Home() {
  const [calorieLimit, setCalorieLimit] = useState(() => getFromStorage('calorieLimit', 2000))
  const [meals, setMeals] = useState<Record<string, Meal[]>>(() => getMeals())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    const storedProfile = getUserProfile();
    return storedProfile ? { ...storedProfile, activity_level: storedProfile.activity_level || '' } : null;
  })
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)

  useEffect(() => {
    setToStorage('calorieLimit', calorieLimit)
  }, [calorieLimit])

  const addNewMeal = async (description: string) => {
    try {
      const newMeals = await apiService.estimateMealInfo(description)
      const dateKey = format(selectedDate, 'yyyy-MM-dd')
      newMeals.forEach(meal => addMeal(dateKey, meal))
      setMeals(getMeals())
    } catch (error) {
      console.error('Failed to add meal:', error)
    }
  }

  const editMeal = (dateKey: string, index: number, updatedMeal: Meal) => {
    updateMeal(dateKey, index, updatedMeal);
    setMeals(getMeals());
  };

  const removeMealFromList = (dateKey: string, index: number) => {
    removeMeal(dateKey, index);
    setMeals(getMeals());
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfileState(profile)
    setUserProfile(profile)
    setShowProfileForm(false)
  }

  const handleGetAnalysis = async () => {
    if (!userProfile) {
      setShowProfileForm(true)
      return
    }

    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    const dailyMeals = meals[dateKey] || []

    try {
      const analysisResult = await apiService.getDailyAnalysis(dailyMeals, userProfile)
      setAnalysis(analysisResult)
    } catch (error) {
      console.error('Failed to get analysis:', error)
      setAnalysis('Failed to get analysis. Please try again.')
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const dateKey = format(selectedDate, 'yyyy-MM-dd')
  const dailyMeals = meals[dateKey] || []
  const totalCalories = dailyMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = dailyMeals.reduce((sum, meal) => sum + meal.protein, 0)
  const totalFat = dailyMeals.reduce((sum, meal) => sum + meal.fat, 0)
  const totalCarbs = dailyMeals.reduce((sum, meal) => sum + meal.carbs, 0)
  const totalFiber = dailyMeals.reduce((sum, meal) => sum + meal.fiber, 0)
  const caloriePercentage = (totalCalories / calorieLimit) * 100

  return (
    <div className="min-h-screen p-4 bg-gray-50 relative">
      <CalorieBubble percentage={caloriePercentage} />
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Simplest Calorie Tracker</h1>
        <CalorieLimitSetting limit={calorieLimit} setLimit={setCalorieLimit} />
        <div className="mb-4">
          <DateSelector onSelectDate={handleDateSelect} />
        </div>
        <MealInput onAddMeal={addNewMeal} />
        <Summary 
          totalCalories={totalCalories} 
          calorieLimit={calorieLimit}
          totalProtein={totalProtein}
          totalFat={totalFat}
          totalCarbs={totalCarbs}
          totalFiber={totalFiber}
        />
        <div className="mb-4">
          <Button onClick={handleGetAnalysis}>Get Daily Analysis</Button>
        </div>
        {analysis && (
          <div className="mb-4 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Daily Analysis</h2>
            <p>{analysis}</p>
          </div>
        )}
        <MealList 
          meals={dailyMeals} 
          onEditMeal={(index, updatedMeal) => editMeal(dateKey, index, updatedMeal)}
          onRemoveMeal={(index) => removeMealFromList(dateKey, index)}
        />
        {showProfileForm && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <UserProfileForm initialProfile={userProfile} onSave={handleSaveProfile} />
          </div>
        )}
      </div>
    </div>
  )
}

