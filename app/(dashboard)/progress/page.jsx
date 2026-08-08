"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Scale, Plus, Calendar } from 'lucide-react';

export default function ProgressPage() {
  const [weight, setWeight] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false });

    if (data) setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!weight) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('progress_logs').insert({
        user_id: user.id,
        weight: parseFloat(weight),
      });

      // تحديث الوزن الحالي في بروفايل المستخدم
      await supabase.from('profiles').update({ current_weight: parseFloat(weight) }).eq('id', user.id);

      setWeight('');
      fetchLogs();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans" dir="rtl">
      <div>
        <h1 className="text-2xl font-black text-white">سجل التطور والوزن</h1>
        <p className="text-xs text-slate-400">تابع تغيرات وزنك بمرور الوقت لضمان الوصول لهدفك</p>
      </div>

      {/* Weight Input Card */}
      <form onSubmit={handleAddWeight} className="glass-panel p-5 rounded-2xl border border-white/10 flex gap-4 items-end bg-slate-900/40">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-300 mb-2">تسجيل الوزن الجديد (كجم)</label>
          <div className="relative">
            <Scale className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              step="0.1"
              required
              placeholder="75.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-6 bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-bold text-sm rounded-xl hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>حفظ</span>
        </button>
      </form>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden bg-slate-900/40">
        <div className="p-4 border-b border-white/10 font-bold text-sm text-white">السجلات السابقة</div>
        <div className="divide-y divide-white/5">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">لا يوجد سجلات وزن بعد. قم ببدء أول تسجيل!</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 flex justify-between items-center text-sm">
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{new Date(log.logged_at).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="font-bold text-white">{log.weight} كجم</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}