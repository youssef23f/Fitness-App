import Groq from 'groq-sdk';

// 1. تصدير كائن Groq الرئيسي لاستخدامه المباشر في الـ API Routes
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 2. دالة تحليل صور الطعام
export async function analyzeFoodImage(base64Image) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.2-11b-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this food image and estimate calories, protein, carbs, and fats in JSON format.' },
          { type: 'image_url', image_url: { url: base64Image } }
        ]
      }
    ],
    response_format: { type: 'json_object' }
  });
  return JSON.parse(response.choices[0].message.content);
}

// 3. دالة توليد الخطة الرياضية
export async function generateFitnessPlan(userData) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are an expert AI Fitness & Nutrition Coach.' },
      { role: 'user', content: `Generate a custom fitness plan for: ${JSON.stringify(userData)}` }
    ],
  });
  return response.choices[0].message.content;
}