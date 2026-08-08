"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Flame, Dumbbell, Utensils, TrendingUp, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [todayProtein, setTodayProtein] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. جلب بيانات الملف الشخصي والأهداف
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) setProfile(profileData);

      // 2. جلب مجموع وجبات اليوم
      const today = new Date().toISOString().split('T')[0];
      const { data: mealsData } = await supabase
        .from('meals')
        .select('calories, protein')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`);

      if (mealsData) {
        const totalCals = mealsData.reduce((acc, item) => acc + item.calories, 0);
        const totalProt = mealsData.reduce((acc, item) => acc + item.protein, 0);
        setTodayCalories(totalCals);
        setTodayProtein(totalProt);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-cyan-400 p-8">جاري تحميل لوحة التحكم...</div>;

  const targetCals = profile?.target_calories || 2000;
  const targetProt = profile?.target_protein || 150;

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-white">مرحباً بك مجدداً 👋</h1>
        <p className="text-slate-400 text-xs">نظرة عامة على تقدمك اليومي وبناءً على خطتك الذكية</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 text-xs font-semibold">السعرات اليومية</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{todayCalories} <span className="text-xs font-normal text-slate-400">/ {targetCals} kcal</span></div>
          <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((todayCalories / targetCals) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 text-xs font-semibold">البروتين المستهلك</span>
            <Dumbbell className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{todayProtein}g <span className="text-xs font-normal text-slate-400">/ {targetProt}g</span></div>
          <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((todayProtein / targetProt) * 100, 100)}%` }} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/40">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 text-xs font-semibold">الهدف الحالي</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white">{profile?.goal || 'غير محدد'}</div>
          <p className="text-xs text-slate-400 mt-2">الوزن الحالي: {profile?.current_weight || '--'} كجم</p>
        </div>
      </div>

      {/* AI Advice Box */}
      {profile?.ai_plan && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>نصيحة الخطة الذكية المخصصة لك</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{profile.ai_plan.advice}</p>
        </div>
      )}
    </div>
  );
}