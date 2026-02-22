
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Play, Check, X, Timer, Users, Lock } from 'lucide-react';
import { audioService } from '../services/audioService';

const TIMER_DURATION = 60;

export const GameControls: React.FC = () => {
  const { 
    gameStatus, 
    setGameStatus, 
    advanceTeam, 
    switchTurn, 
    currentTurn, 
    currentCard,
    isCardRevealed
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);

  useEffect(() => {
    let interval: number;
    if (gameStatus === 'timer_running' && timeLeft > 0) {
      interval = window.setInterval(() => {
        const nextTime = timeLeft - 1;
        
        if (nextTime <= 10 && nextTime > 0) {
          audioService.playTick();
        }
        
        if (nextTime === 0) {
          audioService.playAlarm();
        }

        setTimeLeft(nextTime);
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === 'timer_running') {
      setGameStatus('resolution');
    }
    return () => clearInterval(interval);
  }, [gameStatus, timeLeft, setGameStatus]);

  const startTimer = () => {
    setTimeLeft(TIMER_DURATION);
    setGameStatus('timer_running');
    audioService.playStartSound();
  };

  const handleCorrect = (winningTeam: 'A' | 'B' | null = null) => {
    const teamToAdvance = winningTeam || currentTurn;
    advanceTeam(teamToAdvance);
    switchTurn(); 
  };

  const handleWrong = () => {
    switchTurn();
  };

  if (gameStatus === 'idle' || gameStatus === 'game_over') return null;

  const isAllPlayMode = currentCard?.category_code === 'T';

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6">
      
      {(gameStatus === 'timer_running' || gameStatus === 'resolution') && (
         <div className="flex flex-col items-center animate-pop">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Fixed: Merged multiple className attributes into one */}
              <Timer className={`sm:w-5 sm:h-5 ${timeLeft <= 10 && timeLeft > 0 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} size={16} />
              <span className={`text-3xl sm:text-5xl font-black font-mono tracking-tighter ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-800'}`}>
                {timeLeft}
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-1 sm:mt-2">Segundos / ثواني</p>
         </div>
      )}

      {gameStatus === 'card_drawn' && (
        <button
          onClick={startTimer}
          disabled={!isCardRevealed}
          className={`w-full py-4 sm:py-5 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all
            ${isCardRevealed 
              ? 'bg-blue-600 text-white shadow-blue-100 active:scale-95' 
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
          `}
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            {isCardRevealed ? <Play fill="currentColor" size={18} className="sm:w-5 sm:h-5" /> : <Lock size={18} className="sm:w-5 sm:h-5" />}
            <span className="text-base sm:text-lg font-bold">Começar Tempo</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-arabic opacity-60">ابدأ الوقت</span>
        </button>
      )}

      {(gameStatus === 'timer_running' || gameStatus === 'resolution') && (
        <div className="flex flex-col gap-3 sm:gap-4 animate-fade">
          
          {isAllPlayMode ? (
             <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xl">
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-purple-600 font-bold">
                    <Users size={16} />
                    <span className="text-xs sm:text-sm">TODOS JOGAM</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-300 font-arabic mt-0.5 sm:mt-1">الجميع يلعب - من فاز؟</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                   <button
                    onClick={() => handleCorrect('A')}
                    className="flex flex-col items-center bg-indigo-600 text-white py-3 sm:py-4 rounded-2xl font-bold active:scale-95 shadow-lg shadow-indigo-100"
                  >
                    <span className="text-sm sm:text-base">Time A</span>
                    <span className="text-[9px] sm:text-[10px] font-arabic opacity-60">الفريق أ</span>
                  </button>
                  <button
                    onClick={() => handleCorrect('B')}
                    className="flex flex-col items-center bg-pink-600 text-white py-3 sm:py-4 rounded-2xl font-bold active:scale-95 shadow-lg shadow-pink-100"
                  >
                    <span className="text-sm sm:text-base">Time B</span>
                    <span className="text-[9px] sm:text-[10px] font-arabic opacity-60">الفريق ب</span>
                  </button>
                </div>
                <button 
                  onClick={handleWrong}
                  className="w-full mt-4 sm:mt-6 text-slate-400 text-[9px] sm:text-[10px] font-bold hover:text-slate-600 uppercase tracking-widest"
                >
                  Ninguém acertou / لم ينجح أحد
                </button>
             </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={handleWrong}
                className="flex flex-col items-center bg-slate-100 text-slate-500 py-3 sm:py-4 rounded-2xl font-bold active:scale-95 transition-all border border-slate-200/50"
              >
                <div className="flex items-center gap-2">
                  <X size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Errou</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-arabic opacity-60">خطأ</span>
              </button>
              <button
                onClick={() => handleCorrect()}
                className="flex flex-col items-center bg-green-500 text-white py-3 sm:py-4 rounded-2xl font-bold active:scale-95 shadow-lg shadow-green-100 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Check size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Acertou</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-arabic opacity-60">صح</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
