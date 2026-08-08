import './globals.css';

export const metadata = {
  title: 'FITNESS.AI — Next-Gen AI Fitness & Nutrition Platform',
  description: 'AI-Powered Fitness & Nutrition Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#080C14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-400">
        {children}
      </body>
    </html>
  );
}