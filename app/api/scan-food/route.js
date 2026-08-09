import { NextResponse } from 'next/server';
import { analyzeFoodImage } from '@/lib/ai';

export const maxDuration = 30; // زيادة وقت الاستجابة المسموح

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'يرجى تزويد صورة الطعام' }, { status: 400 });
    }

    const result = await analyzeFoodImage(image);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Scan Food API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحليل الصورة، يرجى اختيار صورة بحجم أصغر.' },
      { status: 500 }
    );
  }
}