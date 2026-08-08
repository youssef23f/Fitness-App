"use client";

import { useState } from 'react';
import { Camera, Upload, Sparkles, Check, RefreshCw, Scale, Flame, AlertCircle } from 'lucide-react';
import { analyzeFoodImage } from '@/lib/ai';

export default function FoodScannerPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [portion, setPortion] = useState(250); // بالجرام

  // التعامل مع رفع الصورة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // بدء التحليل بالذكاء الاصطناعي
  const startAiScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);

    // 1. التعرف المرن من خلال الـ Vision Model
    const visionData = await analyzeFoodImage(selectedImage);
    
    // 2. محاكاة جلب البيانات الدقيقة من Nutrition DB بناءً على الوزن
    setTimeout(() => {
      const baseWeight = visionData.estimated_weight_g || 200;
      setPortion(baseWeight);
      
      setAnalysisResult({
        foodName: visionData.food_name || "وجبة مشكلة (Grilled Salmon & Veggies)",
        confidence: 96.4,
        baseNutritionPer100g: { calories: 165, protein: 22, carbs: 4, fat: 7 }
      });
      
      setIsScanning(false);
    }, 1500);
  };

  // حساب القيم الغذائية بناءً على حجم الوجبة المحدد من المستخدم
  const calculateNutrients = (nutrientPer100g) => {
    if (!nutrientPer100g) return 0;
    return Math.round((nutrientPer100g * portion) / 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI Food Scanner
          </h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          ارفع أو التقط صورة وجبتك للتعرف الفوري على المكونات والقيم الغذائية بدقة متناهية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Upload & Radar Area */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-3xl p-4 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] bg-[#0B111E]">
            
            {selectedImage ? (
              <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-black/40">
                <img 
                  src={selectedImage} 
                  alt="Food Scan" 
                  className="w-full h-full object-cover"
                />

                {/* Radar Scanning Line Effect */}
                {isScanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 animate-pulse flex flex-col justify-between pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-bounce" />
                    <div className="text-center py-2 bg-black/60 backdrop-blur-md text-cyan-400 text-xs font-mono tracking-widest uppercase border-y border-cyan-500/30">
                      [ Vision Model Processing & Mapping Nutrition DB... ]
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Dropzone Placeholder */
              <label className="w-full h-[340px] border-2 border-dashed border-white/15 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200">اضغط لرفع صورة أو اسحبها هنا</p>
                  <p className="text-xs text-slate-500 mt-1">يدعم JPG, PNG, WEBP حتى 10MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}

            {/* Action Bar Under Image */}
            {selectedImage && (
              <div className="w-full flex items-center justify-between gap-4 mt-4 px-2">
                <label className="flex items-center gap-2 text-xs text-slate-400 hover:text-white cursor-pointer bg-white/5 px-4 py-2 rounded-xl border border-white/5 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>تغيير الصورة</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {!analysisResult && (
                  <button
                    onClick={startAiScan}
                    disabled={isScanning}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-90 disabled:opacity-50 cursor-pointer transition-all"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري التحليل...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>تحليل الوجبة بالذكاء الاصطناعي</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis HUD Card */}
        <div className="lg:col-span-5 space-y-6">
          {analysisResult ? (
            <div className="glass-panel-glow p-6 rounded-3xl space-y-6 border border-cyan-500/30">
              
              {/* Food Name & AI Confidence */}
              <div>
                <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-1">
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> AI RECOGNIZED</span>
                  <span>{analysisResult.confidence}% ACCURACY</span>
                </div>
                <h2 className="text-xl font-bold text-white capitalize">{analysisResult.foodName}</h2>
              </div>

              {/* Portion Modifier Slider */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5"><Scale className="w-4 h-4 text-cyan-400" /> الكمية الملموسة:</span>
                  <span className="font-bold text-cyan-400 text-sm">{portion} جرام</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="800" 
                  step="10" 
                  value={portion} 
                  onChange={(e) => setPortion(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              {/* Nutrition Matrix */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <Flame className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <span className="text-2xl font-black text-white">
                    {calculateNutrients(analysisResult.baseNutritionPer100g.calories)}
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Calories (kcal)</span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-emerald-400">
                    {calculateNutrients(analysisResult.baseNutritionPer100g.protein)}g
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider mt-1">Protein</span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-amber-400">
                    {calculateNutrients(analysisResult.baseNutritionPer100g.carbs)}g
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider mt-1">Carbs</span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-purple-400">
                    {calculateNutrients(analysisResult.baseNutritionPer100g.fat)}g
                  </span>
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider mt-1">Fats</span>
                </div>
              </div>

              {/* Confirm & Add Button */}
              <button className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold py-3 rounded-2xl shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer text-sm">
                إضافة الوجبة إلى سجل اليوم
              </button>
            </div>
          ) : (
            /* Empty State Guidance */
            <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">في انتظار تحليل الصورة</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                قم برفع صورة الوجبة للبدء. سيقوم الـ Vision Model باستخراج المكونات والوزن التقديري، ثم مطابقتها مع قاعدة البيانات.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}