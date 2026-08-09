'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [todayLog, setTodayLog] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. جلب بيانات ملف المستخدم والأهداف
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
        });
      }
      setLoading(false);
    }

    fetchUserData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400">جاري تحميل بياناتك الحقيقية...</div>;

  if (!profile) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">أهلاً بك معنا! 👋</h2>
        <p className="text-slate-400 text-sm mb-4">لم تقم بإدخال بياناتك الرياضية بعد لحساب احتياجك اليومي.</p>
        <Link href="/onboarding" className="bg-cyan-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl inline-block">
          إعداد خطتك الآن 🚀
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">مرحباً {profile.full_name || 'يا بطل'} 👋</h1>
          <p className="text-xs text-slate-400">الهدف الحالي: {profile.goal}</p>
        </div>
        <Link href="/onboarding" className="text-xs text-cyan-400 underline">تعديل الهدف والبيانات</Link>
      </div>

      {/* العناصر الغذائية - أرقام حقيقية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">إجمالي السعرات</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{todayLog.calories} / <span className="text-base text-slate-500">{profile.target_calories} kcal</span></p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">البروتين الصافي</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{todayLog.protein}g / <span className="text-base text-slate-500">{profile.target_protein}g</span></p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">الكربوهيدرات</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{todayLog.carbs}g / <span className="text-base text-slate-500">{profile.target_carbs}g</span></p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">الدهون الصحية</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{todayLog.fats}g / <span className="text-base text-slate-500">{profile.target_fats}g</span></p>
        </div>
      </div>
    </div>
  );
}