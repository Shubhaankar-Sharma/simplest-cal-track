import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

interface Props {
  onSelectDate: (date: Date) => void;
}

export default function DateSelector({ onSelectDate }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      onSelectDate(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date ? format(date, 'PPP') : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

