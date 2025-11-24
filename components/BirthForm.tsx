import React, { useState } from 'react';
import { BirthData } from '../types';

interface BirthFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading: boolean;
}

const BirthForm: React.FC<BirthFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<BirthData>({
    name: '',
    date: '',
    time: '09:00',
    province: 'กรุงเทพมหานคร'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden group">
      {/* Decorative glow background */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <h2 className="text-2xl font-bold text-center mb-6 text-white relative z-10">ผูกดวงวางลัคนา</h2>
      
      <div className="space-y-4 relative z-10">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">ชื่อ - นามสกุล</label>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            placeholder="ใส่ชื่อของคุณ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">วันเกิด</label>
          <input
            required
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">เวลาเกิด (โดยประมาณ)</label>
          <input
            required
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">จังหวัดที่เกิด</label>
          <input
            required
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            placeholder="เช่น กรุงเทพฯ, เชียงใหม่"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังคำนวณดวงชะตา...
            </span>
          ) : (
            "ทำนายดวงชะตา"
          )}
        </button>
      </div>
    </form>
  );
};

export default BirthForm;
