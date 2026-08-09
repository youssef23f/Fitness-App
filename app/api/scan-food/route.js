'use client';

import { useState } from 'react';

export default function ScanFoodPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // دالة ضغط وتصغير الصورة تلقائياً لحجم مناسب للـ AI
  const compressAndConvertImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // أقصى عرض كافٍ جدا للذكاء الاصطناعي
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // ضغط الصورة بصيغة JPEG بجودة 0.7
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ضغط الصورة فور تحديدها
    const compressedData = await compressAndConvertImage(file);
    setImagePreview(compressedData);
    setBase64Image(compressedData);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!base64Image) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/scan-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'حدث خطأ أثناء التحليل');
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 text-white dir-rtl">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        فاحص الطعام بالذكاء الاصطناعي 📸
      </h1>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
        />

        {imagePreview && (
          <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 max-h-64 flex justify-center bg-black">
            <img src={imagePreview} alt="Food Preview" className="object-contain h-64" />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!base64Image || loading}
          className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl disabled:opacity-50 hover:bg-cyan-400 transition"
        >
          {loading ? 'جاري تحليل السعرات والماكروز...' : 'تحليل الطعام'}
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-cyan-400">{result.food_name || 'الوجبة المكتشفة'}</h2>
          <p className="text-slate-300 text-sm">{result.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-center">
            <div className="bg-slate-950 p-3 rounded-xl">
              <p className="text-xs text-slate-400">السعرات</p>
              <p className="text-lg font-bold text-cyan-400">{result.calories} kcal</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl">
              <p className="text-xs text-slate-400">البروتين</p>
              <p className="text-lg font-bold text-emerald-400">{result.protein}g</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl">
              <p className="text-xs text-slate-400">الكربوهيدرات</p>
              <p className="text-lg font-bold text-amber-400">{result.carbs}g</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl">
              <p className="text-xs text-slate-400">الدهون</p>
              <p className="text-lg font-bold text-purple-400">{result.fats}g</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}