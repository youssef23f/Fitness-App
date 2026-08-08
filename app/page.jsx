"use client";

import Link from 'next/link';
import { Sparkles, ArrowRight, Activity, Scan, ShieldCheck, Zap, ChevronRight, Play } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-400 overflow-hidden relative">
      
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-emerald-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            FITNESS<span className="text-cyan-400">.AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-all"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>دخول المنصة</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 relative z-10 text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>الجيل القادم من منصات اللياقة والتغذية بالذكاء الاصطناعي</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.15] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          مستقبل التغذية واللياقة البدنية بين يديك، بدقة متناهية.
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          التقط صورة وجبتك ليحللها الموديل البصري وقواعد التغذية الدقيقة فوراً. مدربك الشخصي الذكي يتعلم من بياناتك اليومية ليقودك لنواياك الرياضية.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            <span>ابدأ التجربة المستقبليّة الآن</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#visual-demo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 glass-panel border border-white/10 hover:border-white/20 text-slate-200 font-semibold px-6 py-4 rounded-2xl transition-all cursor-pointer text-sm"
          >
            <Play className="w-4 h-4 fill-slate-200" />
            <span>مشاهدة العرض التفاعلي</span>
          </a>
        </div>

        {/* Interactive Visual HUD Section */}
        <div id="visual-demo" className="pt-12 relative max-w-5xl mx-auto">
          <div className="glass-panel-glow p-3 rounded-3xl border border-cyan-500/30 shadow-2xl relative">
            
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60 inline-block" />
              </div>
              <span className="font-mono text-[11px] text-cyan-400/80">FX-VISION-PIPELINE // REALTIME DEMO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 items-center text-right bg-[#0B111E]/90 rounded-2xl">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Scan className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">الماكينة البصرية (Vision Model)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  التعرف التلقائي على أصناف الوجبة وتقدير الوزن البصري بدقة عبر موديل رؤية مفتوح المصدر.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3 border-cyan-500/30 bg-cyan-500/[0.02]">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">مطابقة Nutrition DB</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  حساب السعرات والماكروز من قاعدة بيانات تغذية رسمية بدون الاعتماد على تخمين الـ LLM.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">مدرب الاستدلال الذكي</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تحليل النتائج فورياً وتوفير نصائح مخصصة وموجهة بناءً على استجابتك اليومية وهدفك.
                </p>
              </div>
            </div>

          </div>
        </div>

      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-500">
        <p> جميع الحقوق محفوظة © FITNESS.AI — خيارك لتجربة لياقة مستقبلية متكاملة.</p>
      </footer>

    </div>
  );
}