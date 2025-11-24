import React, { useState } from 'react';
import { BirthData, ChartData } from './types';
import BirthForm from './components/BirthForm';
import AstrologyChart from './components/AstrologyChart';
import { generateAstrologyData } from './services/geminiService';

function App() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: BirthData) => {
    setLoading(true);
    setError(null);
    setChartData(null);
    try {
      const result = await generateAstrologyData(data);
      setChartData(result);
    } catch (err: any) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการคำนวณ กรุณาลองใหม่อีกครั้ง หรือตรวจสอบ API Key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101b] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b101b] to-black text-gray-100 pb-20">
      <header className="pt-10 pb-6 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-lg mb-2">
          จักรราศีทำนาย
        </h1>
        <p className="text-slate-400 font-light">Suriyayart Astrology System AI</p>
      </header>

      <main className="container mx-auto px-4">
        {/* Input Section */}
        {!chartData && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <BirthForm onSubmit={handleFormSubmit} isLoading={loading} />
            {error && (
              <div className="mt-4 bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Result Section */}
        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
            
            {/* Left Column: Chart */}
            <div className="flex flex-col items-center">
              <div className="w-full bg-slate-800/50 rounded-3xl p-4 md:p-8 border border-slate-700 shadow-2xl backdrop-blur-sm">
                <h3 className="text-xl text-yellow-500 text-center mb-4 font-semibold">ดวงพิชัยสงคราม (จำลอง)</h3>
                <AstrologyChart data={chartData} />
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm text-slate-400 text-center">
                  <div className="bg-slate-900/80 p-2 rounded">ลัคนา (ล): {chartData.ascendant.degrees}°</div>
                  {chartData.planets.slice(0, 7).map((p, i) => (
                    <div key={i} className="bg-slate-900/80 p-2 rounded">
                       {p.thaiName} ({p.symbol}): {p.degrees}°
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => setChartData(null)}
                className="mt-8 text-slate-400 hover:text-white underline decoration-dotted underline-offset-4"
              >
                ← คำนวณดวงชะตาใหม่
              </button>
            </div>

            {/* Right Column: Prediction */}
            <div className="flex flex-col justify-center">
              <div className="bg-slate-800/80 rounded-3xl p-6 md:p-10 border border-yellow-500/20 shadow-[0_0_50px_-12px_rgba(234,179,8,0.1)]">
                <h2 className="text-3xl font-bold text-yellow-400 mb-6 border-b border-slate-600 pb-4">
                  คำทำนายดวงชะตา
                </h2>
                
                <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-loose whitespace-pre-line font-light">
                  {chartData.prediction}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xl">
                     ✨
                   </div>
                   <div>
                     <p className="text-sm text-slate-400">คำทำนายโดย</p>
                     <p className="font-bold text-white">Gemini AI Astrologer</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
