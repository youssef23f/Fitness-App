import { NextResponse } from 'next/server';
import { groq } from '@/lib/ai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, userName } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'قائمة الرسائل غير صالحة' },
        { status: 400 }
      );
    }

    const systemMessage = {
      role: 'system',
      content: `أنت كوتش لياقة وتغذية ذكي واحترافي اسمه FITNESS.AI Coach. تتحدث مع المستخدم ${
        userName || 'يا بطل'
      }. أسلوبك مشجع ومحفز، وإجاباتك دقيقة ومباشرة باللغة العربية. تقديم نصائح في التغذية والتمارين والتخصيص بناءً على أهداف المستخدم.`,
    };

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply =
      response.choices[0]?.message?.content ||
      'عذراً، لم أستطع معالجة الإجابة حالياً. حاول مرة أخرى.';

    return NextResponse.json({ result: reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الاتصال بالخادم' },
      { status: 500 }
    );
  }
}