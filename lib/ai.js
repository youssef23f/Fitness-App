// lib/ai.js

export async function analyzeFoodImage(base64Image) {
  try {
    // 1. استدعاء الموديل البصري مفتوح المصدر (مثل Qwen2.5-VL أو Llama 3.2 Vision)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-vl-72b-instruct:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this food image. Identify the main food item and estimate its portion weight in grams. Return ONLY a raw JSON object with keys: "food_name" (string) and "estimated_weight_g" (number). Do not calculate calories.'
              },
              {
                type: 'image_url',
                image_url: { url: base64Image }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // استخراج الـ JSON
    const cleanJson = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Vision Error:", error);
    // بيانات افتراضية تجريبية للـ Fallback
    return { food_name: "Chicken Breast with Rice", estimated_weight_g: 250 };
  }
}