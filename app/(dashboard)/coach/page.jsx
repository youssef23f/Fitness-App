'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Send, Bot, User, Trash2, Loader2, Sparkles } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AICoachPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);

  // التمرير التلقائي لآخر رسالة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // جلب اسم المستخدم الحقيقي من جدول profiles أو Supabase Auth
  useEffect(() => {
    async function initUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // البحث عن الاسم أولاً في جدول profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '';
        setUserName(name);

        setMessages([
          {
            role: 'assistant',
            content: `مرحباً ${name ? name : 'يا بطل'}! 👋 أنا كوتشك الذكي. كيف يمكنني مساعدتك في خطتك الرياضية والتغذوية اليوم؟`
          }
        ]);
      } else {
        setMessages([
          {
            role: 'assistant',
            content: 'مرحباً بك! 👋 أنا كوتشك الذكي. كيف يمكنني مساعدتك في خطتك الرياضية والتغذوية اليوم؟'
          }
        ]);
      }
    }
    initUser();
  }, []);

  // إرسال الرسالة إلى الـ API
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userName }),
      });

      if (!response.ok) throw new Error('فشل الاتصال بالكوتش');

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.result || data.message }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // مسح المحادثة
  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `مرحباً ${userName ? userName : 'يا بطل'}! 👋 تم بدء محادثة جديدة. كيف أستطيع مساعدتك؟`
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              FITNESS.AI Coach
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Llama 3.3
              </span>
            </h1>
            <p className="text-xs text-slate-400">مدربك الشخصي المدعوم بالذكاء الاصطناعي</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          title="مسح المحادثة"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 border border-slate-700 text-cyan-400'
              }`}
            >
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-slate-400 flex items-center gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              الكوتش يفكر في الإجابة...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اسأل الكوتش عن التغذية، التمارين، أو ترتيب الوجبات..."
          className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}