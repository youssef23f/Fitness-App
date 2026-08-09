import { NextResponse } from 'next/server';
import { analyzeFoodImage } from '@/lib/ai';

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'لم يتم توفير صورة للتحليل' },
        { status: 400 }
      );
    }

    // استدعاء دالة تحليل الوجبة من lib/ai.js
    const nutritionData = await analyzeFoodImage(image);

    return NextResponse.json(nutritionData);
  } catch (error) {
    console.error('Error in scan-food API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحليل صورة الطعام' },
      { status: 500 }
    );
  }
}