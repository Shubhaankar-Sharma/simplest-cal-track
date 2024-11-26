import { useEffect, useRef } from 'react'

interface Props {
  percentage: number;
}

export default function CalorieBubble({ percentage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Create gradient
    let gradient
    if (percentage <= 100) {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)')  // Light green
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0.8)')  // Dark green
    } else if (percentage <= 120) {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(234, 179, 8, 0.2)')  // Light yellow
      gradient.addColorStop(1, 'rgba(234, 179, 8, 0.8)')  // Dark yellow
    } else {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)')  // Light red
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.8)')  // Dark red
    }

    // Draw bubble
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = gradient
    ctx.fill()

    // Add shine effect
    const shineGradient = ctx.createRadialGradient(
      centerX - radius / 3, centerY - radius / 3, radius / 10,
      centerX, centerY, radius
    )
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = shineGradient
    ctx.fill()

  }, [percentage])

  return (
    <canvas 
      ref={canvasRef} 
      width={100} 
      height={100} 
      className="absolute top-4 right-4 z-10"
      aria-label={`Calorie intake indicator: ${percentage <= 100 ? 'Good' : percentage <= 120 ? 'Warning' : 'Danger'}`}
    />
  )
}

