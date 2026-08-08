import { groq } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { age, weight, height, goal } = await req.json();

    const prompt = `
      بصفتك كوتش ذكي وخبير تغذية، قم بتحليل البيانات التالية:
      - السن: ${age} سنة
      - الوزن: ${weight} كجم
      - الطول: ${height} سم
      - الهدف: ${goal}

      أخرج النتيجة بصيغة JSON حصراً بهذا الشكل بدون أي نص إضافي:
      {
        "target_calories": 2200,
        "target_protein": 150,
        "plan_details": {
          "workout_days": "4 أيام في الأسبوع",
          "cardio_recommendation": "20 دقيقة بعد التمرين",
          "advice": "نصيحة سريعة حول الماكروز وجداول الوجبات"
        }
      }
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'فشل إنشاء الخطة' }, { status: 500 });
  }
}