import { groq } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, userContext } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `أنت كوتش رياضي ومستشار تغذية متقدم واسمك FITNESS.AI.
          بيانات المستخدم الحالية:
          - الوزن: ${userContext?.weight || 'غير محدد'} كجم
          - الهدف: ${userContext?.goal || 'غير محدد'}
          أجب عن أسئلة المستخدم باللغة العربية بأسلوب محفز، علمي ومباشر.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.3-70b-versatile', // موديل مفتوح المصدر قوي وسريع للغاية
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'لم أستطع معالجة الطلب.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Groq AI Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء الاتصال بالـ AI' }, { status: 500 });
  }
}