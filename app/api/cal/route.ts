import { NextResponse } from 'next/server';
import { getClaudeCalories } from '@/utils/api';
import type { CalorieReq } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body: CalorieReq = await request.json();
    const meals = await getClaudeCalories(body.prompt);
    return NextResponse.json({ meals });
  } catch (error) {
    console.error('Error in /api/cal:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}