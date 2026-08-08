import { groq } from '@/lib/ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview', // موديل بيلقط الصور مجاناً
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `حلل هذه الصورة وأعطني تقدير السعرات والماكروز في JSON حصراً:
              {
                "mealName": "اسم الوجبة بالعربي",
                "calories": 450,
                "protein": 30,
                "carbs": 45,
                "fats": 10
              }`
            },
            {
              type: 'image_url',
              image_url: { url: imageBase64 }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' }
    });

    const nutritionData = JSON.parse(completion.choices[0]?.message?.content);
    return NextResponse.json(nutritionData);
  } catch (error) {
    console.error('Vision Error:', error);
    return NextResponse.json({ error: 'تعذر تحليل صورة الوجبة' }, { status: 500 });
  }
}