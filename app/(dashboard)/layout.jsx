"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Bot, Scan, Utensils, TrendingUp, User, Activity, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Coach', href: '/coach', icon: Bot },
  { name: 'Food Scanner', href: '/scanner', icon: Scan },
  { name: 'Nutrition', href: '/nutrition', icon: Utensils },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function AppDashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => authListener?.subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center text-cyan-400 font-medium">
        جاري جلب البيانات...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#080C14] text-slate-100 overflow-hidden font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-l border-white/10 flex flex-col justify-between p-4 hidden md:flex">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center font-bold text-black shadow-lg shadow-cyan-500/20">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              FITNESS<span className="text-cyan-400">.AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                  <Icon className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Logged-In User Info */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="text-xs truncate">
              <p className="font-semibold text-white truncate">{user?.email?.split('@')[0] || 'مستخدم'}</p>
              <p className="text-cyan-400/80 text-[10px]">حساب نشط</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}