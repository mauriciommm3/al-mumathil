
import React from 'react';
import { Card, CategoryCode } from '../types';
import {
  Eye,
  RefreshCw,
  User,
  Package,
  Clapperboard,
  Brain,
  Theater,
  Users,
  HelpCircle,
  Zap
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { useGameStore } from '../store/useGameStore';

interface CardDisplayProps {
  card: Card;
  onRedraw: () => void;
  loading: boolean;
}

const CategoryIcon = ({ code, size = 24, className = "" }: { code: CategoryCode, size?: number, className?: string }) => {
  const icons = {
    P: User,
    O: Package,
    A: Clapperboard,
    D: Brain,
    L: Theater,
    T: Users,
  };

  const IconComponent = icons[code] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, onRedraw, loading }) => {
  const { isCardRevealed, revealCard } = useGameStore();
  const category = CATEGORIES[card.category_code];

  const points = card.category_code === 'D' ? 2 : 1;

  if (!isCardRevealed) {
    return (
      <div className="w-full max-h-full flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-50 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 animate-pop overflow-hidden">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[1.75rem] ${category.color} flex items-center justify-center mb-4 sm:mb-6 shadow-2xl shadow-current/20 ring-4 ring-white`}>
          <CategoryIcon code={card.category_code} size={28} className="text-white sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 text-center">{category.label}</h3>
        <p className="text-xs sm:text-sm text-slate-400 text-center mb-8 sm:mb-10 font-arabic">{card.category_name.ar}</p>

        <button
          onClick={revealCard}
          className="flex flex-col items-center gap-1 bg-slate-900 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all hover:bg-slate-800 w-full max-w-xs"
        >
          <div className="flex items-center gap-2.5">
            <Eye size={18} />
            <span className="text-sm sm:text-base">Revelar Palavra</span>
          </div>
          <span className="text-xs font-arabic opacity-80">اكشف الكلمة</span>
        </button>
        <div className="mt-3 text-[9px] sm:text-[10px] text-slate-300 uppercase tracking-[0.2em] flex flex-col items-center gap-0.5">
          <span>Toque para ver</span>
          <span className="font-arabic lowercase tracking-normal uppercase">انقر للرؤية</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-h-full flex flex-col p-6 sm:p-8 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-50 shadow-sm relative overflow-hidden animate-fade">
      <div className={`absolute top-0 left-0 w-full h-1.5 sm:h-2 ${category.color}`} />

      <div className="flex justify-between items-start mb-4 sm:mb-8 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${category.color} text-white`}>
            <CategoryIcon code={card.category_code} size={14} className="sm:w-4 sm:h-4" />
          </div>
          <div className="flex flex-col">
            <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest ${category.color.replace('bg-', 'text-')}`}>
              {category.label}
            </span>
            <span className="font-arabic text-[8px] sm:text-[10px] text-slate-400">
              {category.labelAr}
            </span>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-sm ${points > 1 ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
          {points > 1 && <Zap size={12} className="fill-current" />}
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] font-bold">{points} {points === 1 ? 'Ponto' : 'Pontos'}</span>
            <span className="font-arabic text-[9px] opacity-80">{points === 1 ? 'نقطة' : 'نقاط'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-10 overflow-y-auto min-h-0 py-2">
        <div className="text-center animate-slide-up flex flex-col items-center justify-center shrink-0 w-full px-2">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight break-words hyphens-auto leading-tight w-full">
            {card.word.pt}
          </h2>
        </div>

        <div className="text-center bg-[#F2F2F7] w-full py-4 sm:py-8 px-4 rounded-[1.25rem] sm:rounded-[2rem] border border-slate-100 animate-slide-up shadow-inner flex flex-col items-center justify-center shrink-0 mt-2 sm:mt-0">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-800 font-arabic break-words leading-relaxed w-full" dir="rtl">
            {card.word.ar}
          </h2>
        </div>
      </div>

      <div className="mt-4 sm:mt-8 flex items-center justify-center shrink-0">
        <button
          onClick={onRedraw}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 sm:py-4 rounded-xl transition-colors disabled:opacity-50 active:scale-[0.98] border border-slate-200 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-blue-500" : "text-slate-500"} />
          <div className="flex flex-col items-start text-left leading-tight">
            <span className="text-sm font-bold">{loading ? "Carregando..." : "Trocar Palavra"}</span>
            <span className="text-[10px] sm:text-xs font-arabic opacity-70">{loading ? "جاري التحميل..." : "تغيير الكلمة"}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
