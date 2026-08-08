"use client";

import { useState } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';

export default function CoachPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً يوسف! أنا كوتشك الذكي. كيف يمكنني مساعدتك في خطتك الرياضية والتغذوية اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userContext: { weight: 79.5, goal: 'Lean Bulk' }
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'حدث خطأ أثناء الاتصال، حاول مجدداً.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col justify-between pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            FITNESS.AI Coach
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">مدربك الشخصي المدعوم بـ Llama 3.3 Open-Source Engine</p>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${msg.role === 'user' ? 'bg-cyan-500 text-black' : 'bg-white/10 text-cyan-400'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-500/10 border border-cyan-500/20 text-slate-100' : 'glass-panel text-slate-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
            <Bot className="w-4 h-4" />
            <span>الكوتش يفكر في إجابة دقيقة...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اسأل الكوتش عن التغذية، التمارين، أو ترتيب الوجبات..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-5 pl-14 text-sm text-white focus:outline-none focus:border-cyan-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-tr from-cyan-500 to-emerald-400 text-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}