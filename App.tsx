
import React, { useState } from 'react';
import { Board } from './components/Board';
import { CardDisplay } from './components/CardDisplay';
import { GameControls } from './components/GameControls';
import { useGameStore } from './store/useGameStore';
import { generateCard } from './services/cardService';
import { CategoryRoulette } from './components/CategoryRoulette';
import { CATEGORY_PATTERN, CATEGORIES, GAME_TITLE, GAME_SUBTITLE, isAllPlayHouse } from './constants';
import {
  Trophy,
  RotateCcw,
  Theater,
  User,
  Package,
  Clapperboard,
  Brain,
  Users,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { CategoryCode } from './types';

const CategoryIcon = ({ code, size = 24, className = "" }: { code: CategoryCode, size?: number, className?: string }) => {
  const icons = {
    P: User,
    O: Package,
    A: Clapperboard,
    D: Brain,
    L: Theater,
    T: Users,
  };

  const IconComponent = icons[code as any] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};

const App: React.FC = () => {
  const {
    gameStatus,
    setGameStatus,
    currentTurn,
    teamAPosition,
    teamBPosition,
    currentCard,
    setCard,
    winner,
    resetGame,
    usedWords,
    setWinningScore,
    drawnCategory,
    setDrawnCategory
  } = useGameStore();

  const [loading, setLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const activePosition = currentTurn === 'A' ? teamAPosition : teamBPosition;
  const currentHouse = activePosition === 0 ? 0 : activePosition;
  const isAllPlay = isAllPlayHouse(currentHouse);

  let activeCategoryCode: CategoryCode | '?' = '?';
  let activeCategory: any = null;

  if (gameStatus === 'idle') {
    if (isAllPlay) {
      activeCategoryCode = 'T';
      activeCategory = CATEGORIES['T'];
    }
  } else {
    // If not idle, we are playing a card. We should show the card's category.
    if (currentCard) {
      activeCategoryCode = currentCard.category_code;
      activeCategory = CATEGORIES[currentCard.category_code];
    }
  }

  // Fallback for neutral state
  if (!activeCategory) {
    activeCategory = {
      code: '?',
      label: 'Sorteio',
      labelAr: 'سحب',
      color: 'bg-slate-400',
    };
  }

  const handleDrawCard = async (overrideCategory?: CategoryCode) => {
    setLoading(true);
    const catToDraw = (overrideCategory || activeCategoryCode) as CategoryCode;
    try {
      const card = await generateCard(catToDraw, usedWords);
      setCard(card);
    } catch (e) {
      console.error("Erro ao gerar carta", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRouletteComplete = (category: CategoryCode) => {
    setDrawnCategory(category);
    setIsSpinning(false);
    handleDrawCard(category);
  };

  const startGame = (score: number) => {
    setWinningScore(score);
    setGameStatus('idle');
  };

  if (gameStatus === 'setup') {
    return (
      <div className="h-screen w-full bg-[#F2F2F7] flex flex-col items-center justify-center p-6 sm:p-8 text-slate-900 overflow-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[100px] opacity-60"></div>

        <div className="z-10 flex flex-col items-center w-full max-w-md animate-fade">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-[1.8rem] sm:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 shadow-2xl shadow-blue-200/50 border border-white">
            <div className="relative">
              {/* Fixed: Merged multiple className attributes into one */}
              <Theater size={40} className="text-blue-500 sm:w-12 sm:h-12" />
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full border-2 border-white"></div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-1 tracking-tight text-slate-900">{GAME_TITLE}</h1>
          <h2 className="text-lg sm:text-xl text-slate-400 font-arabic mb-8 sm:mb-12">{GAME_SUBTITLE}</h2>

          <div className="w-full space-y-6 sm:space-y-8">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">Quanto tempo deseja jogar?</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-arabic mt-1">كم من الوقت تريد اللعب؟</p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {[10, 20, 30].map(val => (
                <button
                  key={val}
                  onClick={() => startGame(val)}
                  className="w-full group flex items-center justify-between bg-white/70 backdrop-blur-md hover:bg-white border border-white/50 p-4 sm:p-5 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {val}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm sm:text-base text-slate-800">{val} Casas</p>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-arabic">{val} خانات</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 sm:mt-16 flex items-center gap-2 opacity-30">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Português</span>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <span className="text-[10px] font-bold font-arabic">العربية</span>
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === 'game_over' && winner) {
    return (
      <div className="h-screen w-full bg-[#F2F2F7] flex flex-col items-center justify-center p-6 text-slate-900 text-center">
        <div className="z-10 animate-pop flex flex-col items-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-6 sm:mb-8 border border-white">
            <Trophy size={56} className="text-yellow-400 sm:w-16 sm:h-16" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tight">VITÓRIA!</h1>
          <h2 className="text-xl sm:text-2xl font-arabic text-slate-400 mb-8">مبروك الفوز!</h2>

          <div className={`px-6 sm:px-8 py-3 rounded-2xl mb-10 sm:mb-12 font-bold shadow-sm flex flex-col items-center gap-1 ${winner === 'A' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>
            <span>Equipe {winner} venceu o espetáculo!</span>
            <span className="font-arabic text-sm opacity-80">الفريق {winner === 'A' ? 'أ' : 'ب'} فاز بالعرض!</span>
          </div>

          <button
            onClick={resetGame}
            className="bg-blue-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex flex-col items-center gap-1"
          >
            <div className="flex items-center gap-2">
              <RotateCcw size={18} />
              <span>Jogar Novamente</span>
            </div>
            <span className="font-arabic text-xs opacity-80">العب مرة أخرى</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-[#F2F2F7] overflow-hidden">

      <div className="h-[40vh] md:h-full md:w-[320px] lg:w-[360px] w-full shrink-0 border-r border-slate-200/50 relative z-0">
        <Board />
      </div>

      <div className="flex-1 flex flex-col h-full relative z-10 bg-white md:rounded-l-[2.5rem] shadow-2xl overflow-hidden">

        <div className="px-5 py-3 sm:px-6 sm:py-4 flex justify-between items-center z-20 shrink-0 border-b border-slate-50">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`text-lg sm:text-xl font-bold tracking-tight ${currentTurn === 'A' ? 'text-indigo-600' : 'text-pink-600'}`}>
                Equipe {currentTurn === 'A' ? 'A' : 'B'}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${currentTurn === 'A' ? 'bg-indigo-600' : 'bg-pink-600'} animate-pulse`} />
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-arabic font-bold uppercase tracking-widest">الفريق {currentTurn === 'A' ? 'أ' : 'ب'}</span>
          </div>

          <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl ${activeCategory.color} text-white shadow-lg shadow-current/10 flex items-center gap-2 transition-all duration-500`}>
            <CategoryIcon code={activeCategoryCode as CategoryCode} size={12} className="sm:w-3.5 sm:h-3.5" />
            <div className="flex flex-col items-end">
              <span className="font-bold text-[9px] sm:text-[10px] leading-tight">{activeCategory.label}</span>
              <span className="font-arabic text-[8px] sm:text-[9px] leading-tight opacity-90">{activeCategory.labelAr}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
          {gameStatus === 'idle' ? (
            isSpinning ? (
              <CategoryRoulette onComplete={handleRouletteComplete} />
            ) : (
              <div className="text-center max-w-sm animate-fade py-2 sm:py-4">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto ${isAllPlay ? CATEGORIES['T'].color : 'bg-slate-300'} rounded-[1.8rem] sm:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 shadow-2xl shadow-current/20 ring-4 ring-white`}>
                  {isAllPlay ? (
                    <CategoryIcon code='T' size={32} className="text-white sm:w-10 sm:h-10" />
                  ) : (
                    <HelpCircle size={32} className="text-slate-500 sm:w-10 sm:h-10" />
                  )}
                </div>
                <div className="flex flex-col items-center mb-1 sm:mb-2">
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">Vez da Equipe {currentTurn}</h3>
                  <h4 className="text-sm sm:text-lg font-arabic font-bold text-slate-700 mt-1">دور الفريق {currentTurn === 'A' ? 'أ' : 'ب'}</h4>
                </div>

                {isAllPlay ? (
                  <div className="flex flex-col gap-1 mb-6 sm:mb-8 px-4 sm:px-6">
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                      {CATEGORIES['T'].description}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400 font-arabic leading-relaxed font-semibold">
                      {CATEGORIES['T'].descriptionAr}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 mb-6 sm:mb-8 px-4 sm:px-6">
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                      Casa Neutra. Sorteie uma categoria para continuar.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-400 font-arabic leading-relaxed font-semibold">
                      خانة محايدة. اسحب فئة للمتابعة.
                    </p>
                  </div>
                )}

                <button
                  onClick={isAllPlay ? () => handleDrawCard('T') : () => setIsSpinning(true)}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-3 sm:py-4 rounded-2xl shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-[0.97] flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-sm sm:text-lg font-bold">
                    {loading ? 'Preparando...' : (isAllPlay ? 'Retirar Carta' : 'Sortear Categoria')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-arabic opacity-80">
                    {loading ? 'قيد التجهيز...' : (isAllPlay ? 'اسحب بطاقة' : 'اسحب فئة')}
                  </span>
                </button>
              </div>
            )
          ) : (
            <div className="w-full max-w-md h-full flex items-center justify-center py-2 overflow-hidden">
              {currentCard && (
                <CardDisplay
                  card={currentCard}
                  onRedraw={() => handleDrawCard(currentCard.category_code)}
                  loading={loading}
                />
              )}
            </div>
          )}
        </div>

        {gameStatus !== 'idle' && (
          <div className="px-5 py-4 sm:p-6 bg-slate-50/50 backdrop-blur-md border-t border-slate-100 z-20 shrink-0">
            <div className="max-w-md mx-auto">
              <GameControls />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
