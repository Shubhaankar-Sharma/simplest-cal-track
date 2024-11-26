import { NextResponse } from 'next/server';
import { getLLMAnalysis } from '@/utils/api';
import type { AnalysisReq } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body: AnalysisReq = await request.json();
    const response = await getLLMAnalysis(body.meals, body.user_profile);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in /api/analysis:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}