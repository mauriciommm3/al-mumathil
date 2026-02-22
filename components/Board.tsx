
import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { CATEGORIES, isAllPlayHouse } from '../constants';
import { CategoryCode } from '../types';
import { Trophy } from 'lucide-react';

// Remove getCategoryForIndex as it's no longer used for display

export const Board: React.FC = () => {
  const { teamAPosition, teamBPosition, winningScore } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const leader = Math.max(teamAPosition, teamBPosition);
      const targetStep = leader === 0 ? 1 : leader;
      const targetElement = scrollRef.current.querySelector(`[data-step="${targetStep}"]`) as HTMLElement;

      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [teamAPosition, teamBPosition, winningScore]);

  const steps = Array.from({ length: winningScore }, (_, i) => winningScore - i);

  return (
    <div className="w-full h-full bg-[#F2F2F7] flex flex-col relative overflow-hidden">
      <div className="z-30 bg-white/70 backdrop-blur-md border-b border-slate-200/50 p-2 sm:p-3 text-center shadow-sm shrink-0">
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">O Caminho / المسار</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar flex flex-col items-center gap-4 sm:gap-6 pb-20 pt-8 sm:pt-12"
      >
        {steps.map((step) => {
          const isAllPlay = isAllPlayHouse(step);
          const isFinish = step === winningScore;
          const tileBackground = isAllPlay ? CATEGORIES['T'].color : 'bg-slate-300 border-slate-400';

          return (
            <div
              key={step}
              data-step={step}
              className="relative w-full max-w-[170px] sm:max-w-[240px] flex items-center justify-center h-10 sm:h-16 shrink-0"
            >

              {step > 1 && (
                <div className="absolute h-7 sm:h-10 w-0.5 bg-slate-200 top-9 sm:top-14 z-0 rounded-full" />
              )}

              <div
                className={`
                    relative w-9 h-9 sm:w-16 sm:h-16 rounded-[0.75rem] sm:rounded-[1.25rem] flex items-center justify-center shadow-xl z-10 
                    ${isAllPlay ? 'border-2 border-white' : 'border-2'}
                    ${tileBackground}
                    transition-all duration-500
                    ${Math.max(teamAPosition, teamBPosition) === step ? 'scale-110 shadow-blue-200 ring-2 ring-white/50' : 'opacity-80 scale-95'}
                  `}
              >
                <div className="flex flex-col items-center">
                  {isAllPlay && <span className="text-white font-black text-[10px] sm:text-sm leading-none">T</span>}
                  <span className={`${isAllPlay ? 'text-white/40' : 'text-slate-500'} text-[8px] sm:text-[9px] font-bold mt-0.5 sm:mt-1`}>{step}</span>
                </div>

                {isFinish && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full shadow-lg border-2 border-white">
                    <Trophy size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                  </div>
                )}
              </div>

              <div className="absolute w-full flex justify-between px-0.5 pointer-events-none">
                <div className={`transition-all duration-700 transform ${teamAPosition === step ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-6 scale-50'}`}>
                  {teamAPosition === step && (
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-indigo-600 rounded-[0.5rem] sm:rounded-xl border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[9px] sm:text-xs">
                      A
                    </div>
                  )}
                </div>

                <div className={`transition-all duration-700 transform ${teamBPosition === step ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-6 scale-50'}`}>
                  {teamBPosition === step && (
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-pink-600 rounded-[0.5rem] sm:rounded-xl border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[9px] sm:text-xs">
                      B
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex flex-col items-center gap-2 sm:gap-3 mt-4 pb-8">
          <div className={`
            w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center
            ${(teamAPosition === 0 || teamBPosition === 0) ? 'bg-white shadow-md border-solid' : 'bg-transparent'}
          `}>
            <div className="flex gap-1">
              {teamAPosition === 0 && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-indigo-600" />}
              {teamBPosition === 0 && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-pink-600" />}
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Início</p>
            <p className="text-slate-300 text-[9px] sm:text-[10px] font-arabic font-bold">البداية</p>
          </div>
        </div>
      </div>
    </div>
  );
};
