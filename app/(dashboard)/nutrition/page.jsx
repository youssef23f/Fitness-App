"use client";

import { Utensils, Zap, ShieldAlert, Heart, Apple, PieChart } from 'lucide-react';

export default function NutritionPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Utensils className="w-5 h-5" />
          </span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Nutrition Intelligence
          </h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          تحليل دقيق ومفصّل للقيم الغذائية الكبرى (Macros) والدقيقة (Micronutrients) لليوم.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-cyan-400">
          <span className="text-xs text-slate-400 block">إجمالي السعرات اليومية</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">1,850</span>
            <span className="text-xs text-slate-500">/ 2,400 kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: '77%' }}></div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-400">
          <span className="text-xs text-slate-400 block">البروتين الصافي</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">130g</span>
            <span className="text-xs text-slate-500">/ 160g</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '81%' }}></div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-400">
          <span className="text-xs text-slate-400 block">الكربوهيدرات</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">190g</span>
            <span className="text-xs text-slate-500">/ 250g</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '76%' }}></div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-purple-400">
          <span className="text-xs text-slate-400 block">الدهون الصحية</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">45g</span>
            <span className="text-xs text-slate-500">/ 65g</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: '69%' }}></div>
          </div>
        </div>
      </div>

      {/* Micronutrients Grid Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            العناصر الدقيقة (Micronutrients Breakdown)
          </h2>
          <span className="text-xs text-slate-400 font-mono">UPDATED BY NUTRITION DB</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fiber */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">الألياف الغذائية (Fiber)</span>
              <span className="text-cyan-400 font-bold">28g / 30g</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: '93%' }}></div>
            </div>
          </div>

          {/* Sodium */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">الصوديوم (Sodium)</span>
              <span className="text-emerald-400 font-bold">1,800mg / 2,300mg</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* Potassium */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">البوتاسيوم (Potassium)</span>
              <span className="text-amber-400 font-bold">3,100mg / 3,500mg</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}