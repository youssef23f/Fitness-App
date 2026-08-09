'use client';
import { useState } from 'react';

export default function FoodScanner() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await fetch('/api/scan-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('حدث خطأ أثناء تحليل الصورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">فاحص الطعام بالذكاء الاصطناعي 📸</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4 block w-full text-sm text-gray-300" />
      
      {image && (
        <div className="mb-4">
          <img src={image} alt="Food Preview" className="max-h-64 rounded-lg mx-auto mb-4" />
          <button 
            onClick={analyzeImage} 
            disabled={loading}
            className="w-full bg-cyan-500 py-2 rounded-lg font-bold hover:bg-cyan-400 transition"
          >
            {loading ? 'جاري التحليل...' : 'تحليل السعرات والماكروز'}
          </button>
        </div>
      )}

      {result && (
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-xl font-bold mb-2">النتائج:</h2>
          <pre className="text-sm bg-gray-900 p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}