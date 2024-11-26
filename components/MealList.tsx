import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Meal } from '@/services/apiService'

interface Props {
  meals: Meal[];
  onEditMeal: (index: number, updatedMeal: Meal) => void;
  onRemoveMeal: (index: number) => void;
}

export default function MealList({ meals, onEditMeal, onRemoveMeal }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedMeal, setEditedMeal] = useState<Meal | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedMeal({ ...meals[index] });
  };

  const handleSave = () => {
    if (editingIndex !== null && editedMeal) {
      onEditMeal(editingIndex, editedMeal);
      setEditingIndex(null);
      setEditedMeal(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedMeal(null);
  };

  const handleChange = (key: keyof Meal, value: string | number) => {
    if (editedMeal) {
      setEditedMeal({ ...editedMeal, [key]: value });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Meals</h2>
      {meals.map((meal, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            {editingIndex === index ? (
              <div className="space-y-2">
                <Input
                  value={editedMeal?.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="number"
                  value={editedMeal?.calories}
                  onChange={(e) => handleChange('calories', parseInt(e.target.value))}
                  className="mb-2"
                />
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={editedMeal?.protein}
                    onChange={(e) => handleChange('protein', parseInt(e.target.value))}
                    placeholder="Protein (g)"
                  />
                  <Input
                    type="number"
                    value={editedMeal?.fat}
                    onChange={(e) => handleChange('fat', parseInt(e.target.value))}
                    placeholder="Fat (g)"
                  />
                  <Input
                    type="number"
                    value={editedMeal?.carbs}
                    onChange={(e) => handleChange('carbs', parseInt(e.target.value))}
                    placeholder="Carbs (g)"
                  />
                  <Input
                    type="number"
                    value={editedMeal?.fiber}
                    onChange={(e) => handleChange('fiber', parseInt(e.target.value))}
                    placeholder="Fiber (g)"
                  />
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <p className="font-semibold">{meal.name}</p>
                <p>Calories: {meal.calories}</p>
                <p>Protein: {meal.protein}g | Fat: {meal.fat}g | Carbs: {meal.carbs}g | Fiber: {meal.fiber}g</p>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" onClick={() => handleEdit(index)}>Edit</Button>
                  <Button variant="destructive" onClick={() => onRemoveMeal(index)}>Remove</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

