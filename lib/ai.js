import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 1. تحليل صور الطعام وحساب الماكروز
export async function analyzeFoodImage(base64Image) {
  try {
    // التأكد من تنسيق نص الـ Base64 بشكل صحيح
    let cleanBase64 = base64Image;
    if (!cleanBase64.startsWith('data:image')) {
      cleanBase64 = `data:image/jpeg;base64,${cleanBase64}`;
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this food image and estimate the calories, protein, carbs, and fats. Return ONLY a valid JSON object with keys: "food_name" (in Arabic), "calories" (number), "protein" (number), "carbs" (number), "fats" (number), "description" (short Arabic description).',
            },
            {
              type: 'image_url',
              image_url: {
                url: cleanBase64,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq Vision Error Details:', error?.message || error);
    throw error;
  }
}

// 2. توليد خطة لياقة وتغذية مخصصة
export async function generateFitnessPlan(userData) {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'أنت كوتش لياقة وتغذية احترافي. قم بإنشاء خطة تدريب وتغذية مفصلة باللغة العربية بناءً على بيانات المستخدم المقدمة.',
        },
        {
          role: 'user',
          content: `بيانات المستخدم: ${JSON.stringify(userData)}`,
        },
      ],
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating fitness plan:', error);
    throw new Error('فشل في إنشاء خطة اللياقة');
  }
}