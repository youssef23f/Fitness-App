"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Activity, Sparkles, ArrowLeft } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: 'Weight Loss',
    activity_level: 'Moderate'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("غير مسجل دخول");

      // 1. طلب خطة مخصصة من الـ AI بناءً على البيانات
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const planData = await res.json();

      // 2. حفظ البيانات والخطة في Supabase
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        age: parseInt(formData.age),
        current_weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        goal: formData.goal,
        activity_level: formData.activity_level,
        target_calories: planData.target_calories || 2000,
        target_protein: planData.target_protein || 150,
        ai_plan: planData.plan_details,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (err) {
      alert('حدث خطأ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">إعداد خطتك الرياضية</h1>
            <p className="text-xs text-slate-400">أدخل بياناتك ليقوم الـ AI بتصميم جدولك الخاص</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">السن</label>
              <input
                type="number"
                required
                placeholder="24"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">الوزن (كجم)</label>
              <input
                type="number"
                required
                placeholder="75"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">الطول (سم)</label>
            <input
              type="number"
              required
              placeholder="178"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">الهدف الرئيسي</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full bg-[#080C14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Weight Loss">تنشيف وإنقاص الوزن (Fat Loss)</option>
              <option value="Muscle Gain">بناء عضلات (Clean Bulk)</option>
              <option value="Weight Gain">زيادة الوزن الكلي (Weight Gain)</option>
              <option value="Maintenance">الحفاظ على اللياقة (Maintenance)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>جاري تحليل البيانات وإنشاء الخطة...</span>
            ) : (
              <>
                <span>إنشاء الخطة عبر الـ AI</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}