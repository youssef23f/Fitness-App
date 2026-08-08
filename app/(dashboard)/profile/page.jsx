"use client";

import { User, Save } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-2">
        <User className="w-6 h-6 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white">الملف الشخصي</h1>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">الاسم</label>
          <input type="text" defaultValue="يوسف" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">الهدف الحالي</label>
          <select className="w-full bg-[#0B111E] border border-white/10 rounded-xl p-3 text-sm text-white">
            <option>بناء عضلات صافية (Lean Bulk)</option>
            <option>تنشيف وحرق دهون (Cut)</option>
          </select>
        </div>
      </div>
    </div>
  );
}