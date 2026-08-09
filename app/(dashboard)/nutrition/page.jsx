'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NutritionPage() {
  const [profile, setProfile] = useState(null);
  const [todayLog, setTodayLog] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sodium: 0,
    potassium: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNutritionData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. جلب أهداف المستخدم من الملف الشخصي
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      // 2. جلب سجل اليوم الحالي
      const today = new Date().toISOString().split('T')[0];
      const { data: logData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (logData) {
        setTodayLog({
          calories: logData.calories || 0,
          protein: logData.protein || 0,
          carbs: logData.carbs || 0,
          fats: logData.fats || 0,
          fiber: logData.fiber || 0,
          sodium: logData.sodium || 0,
          potassium: logData.potassium || 0,
        });
      }
      setLoading(false);
    }

    fetchNutritionData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">جاري تحميل التحليل الغذائي...</div>;
  }

  const targets = {
    calories: profile?.target_calories || 2000,
    protein: profile?.target_protein || 150,
    carbs: profile?.target_carbs || 200,
    fats: profile?.target_fats || 65,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 text-white dir-rtl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Nutrition Intelligence 🍽️
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          تحليل دقيق ومفصل للقيم الغذائية الكبرى (Macros) والدقيقة (Micronutrients) لليوم.
        </p>
      </div>

      {/* العناصر الكبرى (Macros) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">إجمالي السعرات اليومية</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-cyan-400">{todayLog.calories}</span>
            <span className="text-sm text-slate-500">/ {targets.calories} kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full"
              style={{ width: `${Math.min((todayLog.calories / targets.calories) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">البروتين الصافي</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-emerald-400">{todayLog.protein}g</span>
            <span className="text-sm text-slate-500">/ {targets.protein}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${Math.min((todayLog.protein / targets.protein) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">الكربوهيدرات</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-amber-400">{todayLog.carbs}g</span>
            <span className="text-sm text-slate-500">/ {targets.carbs}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full"
              style={{ width: `${Math.min((todayLog.carbs / targets.carbs) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400">الدهون الصحية</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-purple-400">{todayLog.fats}g</span>
            <span className="text-sm text-slate-500">/ {targets.fats}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full"
              style={{ width: `${Math.min((todayLog.fats / targets.fats) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* العناصر الدقيقة (Micronutrients) */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-200">
          ⚡ العناصر الدقيقة (Micronutrients Breakdown)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <p className="text-xs text-slate-400">الألياف الغذائية (Fiber)</p>
            <p className="text-xl font-bold text-cyan-400 mt-1">
              {todayLog.fiber}g <span className="text-xs text-slate-500">/ 30g</span>
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <p className="text-xs text-slate-400">الصوديوم (Sodium)</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {todayLog.sodium}mg <span className="text-xs text-slate-500">/ 2,300mg</span>
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <p className="text-xs text-slate-400">البوتاسيوم (Potassium)</p>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {todayLog.potassium}mg <span className="text-xs text-slate-500">/ 3,500mg</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}