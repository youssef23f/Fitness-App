'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function OnboardingPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: '1.375', // Moderate
    goal: 'maintain', // maintain, lose, gain
  });

  const calculateMacros = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);
    const activity = parseFloat(formData.activityLevel);

    // BMR using Mifflin-St Jeor Formula
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = formData.gender === 'male' ? bmr + 5 : bmr - 161;

    let tdee = bmr * activity;

    // Adjust target calories based on goal
    if (formData.goal === 'lose') tdee -= 500;
    if (formData.goal === 'gain') tdee += 400;

    const calories = Math.round(tdee);
    const protein = Math.round(weight * 2); // 2g per kg
    const fats = Math.round((calories * 0.25) / 9);
    const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4);

    return { calories, protein, carbs, fats };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('المستخدم غير مسجل');

      const targets = calculateMacros();

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        activity_level: formData.activityLevel,
        goal: formData.goal,
        target_calories: targets.calories,
        target_protein: targets.protein,
        target_carbs: targets.carbs,
        target_fats: targets.fats,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (err) {
      alert('حدث خطأ أثناء حفظ البيانات: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-2">إعداد ملفك الرياضي 🎯</h1>
        <p className="text-sm text-slate-400 text-center mb-6">أدخل بياناتك لحساب سعراتك المخصصة بالذكاء الاصطناعي</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">الاسم الكامل</label>
            <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm" placeholder="أدخل اسمك" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">العمر</label>
              <input type="number" required value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm" placeholder="25" />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">النوع</label>
              <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm">
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">الطول (سم)</label>
              <input type="number" required value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm" placeholder="175" />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">الوزن (كجم)</label>
              <input type="number" required value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm" placeholder="70" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">الهدف</label>
            <select value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm">
              <option value="lose">خسارة وزن (تنشيف)</option>
              <option value="maintain">المحافظة على الوزن الحالي</option>
              <option value="gain">زيادة عضلات (تضخيم)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">مستوى النشاط اليومي</label>
            <select value={formData.activityLevel} onChange={(e) => setFormData({...formData, activityLevel: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm">
              <option value="1.2">خامل (قليل الحركة جداً)</option>
              <option value="1.375">نشاط خفيف (تمرين 1-3 أيام)</option>
              <option value="1.55">نشاط متوسط (تمرين 3-5 أيام)</option>
              <option value="1.725">نشاط عالٍ (تمرين شاق يومياً)</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition mt-4">
            {loading ? 'جاري الحساب والحفظ...' : 'حفظ وإنشاء الخطة 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}