import { Card, CardContent } from '@/components/ui/card'

interface Props {
  totalCalories: number;
  calorieLimit: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalFiber: number;
}

export default function Summary({ totalCalories, calorieLimit, totalProtein, totalFat, totalCarbs, totalFiber }: Props) {
  const remainingCalories = calorieLimit - totalCalories

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">Daily Summary</h2>
        <p>Total Calories: {totalCalories} / {calorieLimit}</p>
        <p>Remaining: {remainingCalories}</p>
        <p>Total Protein: {totalProtein}g</p>
        <p>Total Fat: {totalFat}g</p>
        <p>Total Carbs: {totalCarbs}g</p>
        <p>Total Fiber: {totalFiber}g</p>
      </CardContent>
    </Card>
  )
}

