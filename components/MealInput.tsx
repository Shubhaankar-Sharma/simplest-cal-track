import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  onAddMeal: (description: string) => void;
}

export default function MealInput({ onAddMeal }: Props) {
  const [mealDescription, setMealDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mealDescription.trim()) {
      onAddMeal(mealDescription.trim())
      setMealDescription('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="mealDescription" className="block mb-2">Add a meal:</label>
      <div className="flex">
        <Input
          type="text"
          id="mealDescription"
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
          placeholder="e.g., 2 slices of pizza"
          className="mr-2"
        />
        <Button type="submit">Add</Button>
      </div>
    </form>
  )
}

