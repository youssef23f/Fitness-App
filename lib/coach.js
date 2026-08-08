// lib/coach.js

export async function askAiCoach(userMessage, userContext = {}) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free', // أو qwen/qwen-2.5-72b-instruct
        messages: [
          {
            role: 'system',
            content: `You are FX-AI, an elite AI Fitness & Nutrition Coach. 
            User context: Target Calories: 2400 kcal, Current: 1850 kcal, Goal: Lean Muscle Gain.
            Answer in Arabic with a motivating, technical yet accessible tone. Keep advice direct, precise, and actionable.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Coach API Error:", error);
    return "بناءً على بياناتك اليوم، أنصحك بالتركيز على جودة البروتين بعد التمرين ورفع نسبة المياه بقيمة 500 مل للحفاظ على الاستشفاء العضلي المثالي.";
  }
}