import { NextResponse } from 'next/server';
import { analyzeFoodImage } from '@/lib/ai';

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'يرجى تزويد صورة الطعام' }, { status: 400 });
    }

    const result = await analyzeFoodImage(image);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Scan Food Detailed Error:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تحليل الصورة' },
      { status: 500 }
    );
  }
}