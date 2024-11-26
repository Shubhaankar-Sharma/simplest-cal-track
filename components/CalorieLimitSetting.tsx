import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  limit: number;
  setLimit: (limit: number) => void;
}

export default function CalorieLimitSetting({ limit, setLimit }: Props) {
  const [inputLimit, setInputLimit] = useState(limit.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newLimit = parseInt(inputLimit)
    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="calorieLimit" className="block mb-2">Daily Calorie Limit:</label>
      <div className="flex">
        <Input
          type="number"
          id="calorieLimit"
          value={inputLimit}
          onChange={(e) => setInputLimit(e.target.value)}
          className="mr-2"
        />
        <Button type="submit">Set</Button>
      </div>
    </form>
  )
}

