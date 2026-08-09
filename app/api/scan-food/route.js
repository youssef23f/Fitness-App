import { NextResponse } from 'next/server';
import { analyzeFoodImage } from '@/lib/ai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'يرجى تزويد صورة الطعام' },
        { status: 400 }
      );
    }

    const result = await analyzeFoodImage(image);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Scan Food API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحليل صورة الطعام' },
      { status: 500 }
    );
  }
}