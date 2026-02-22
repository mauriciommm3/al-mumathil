import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '../constants';
import { CategoryCode } from '../types';
import { User, Package, Clapperboard, Brain, Theater } from 'lucide-react';

const CategoryIcon = ({ code, size = 24, className = "" }: { code: CategoryCode, size?: number, className?: string }) => {
    const icons = {
        P: User,
        O: Package,
        A: Clapperboard,
        D: Brain,
        L: Theater,
        T: User, // Fallback, shouldn't be used here
    };
    const IconComponent = icons[code] || User;
    return <IconComponent size={size} className={className} />;
};

interface CategoryRouletteProps {
    onComplete: (category: CategoryCode) => void;
}

export const CategoryRoulette: React.FC<CategoryRouletteProps> = ({ onComplete }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [items, setItems] = useState<CategoryCode[]>([]);

    useEffect(() => {
        // Categories to spin (all except T)
        const availableCategories: CategoryCode[] = ['P', 'O', 'A', 'D', 'L'];

        // Pick the winner
        const winner = availableCategories[Math.floor(Math.random() * availableCategories.length)];

        // Create the roulette strip: 30 items
        const strip: CategoryCode[] = [];
        let lastCategory: CategoryCode | null = null;

        for (let i = 0; i < 30; i++) {
            if (i === 28) {
                // Pos 28 is the winner
                strip.push(winner);
                lastCategory = winner;
            } else {
                // Ensure the new category is different from the last one
                const alternatives = availableCategories.filter(c => c !== lastCategory);
                // Also, if this is the item before the winner (i === 27), make sure it's not the winner
                const finalAlternatives = (i === 27)
                    ? alternatives.filter(c => c !== winner)
                    : alternatives;

                // Fallback in case finalAlternatives is empty (shouldn't happen with 5 categories)
                const safeAlternatives = finalAlternatives.length > 0 ? finalAlternatives : alternatives;

                const nextCategory = safeAlternatives[Math.floor(Math.random() * safeAlternatives.length)];
                strip.push(nextCategory);
                lastCategory = nextCategory;
            }
        }

        setItems(strip);

        // Trigger spin after a tiny delay to ensure render
        setTimeout(() => {
            setIsSpinning(true);
        }, 100);

        // After 4.5 seconds (4s spin + 0.5s pause), complete
        const completeTimer = setTimeout(() => {
            onComplete(winner);
        }, 4500);

        return () => clearTimeout(completeTimer);
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-sm animate-fade py-4 px-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 text-center">Sorteando Categoria...</h3>

            {/* The Roulette Window */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-slate-100 rounded-[2rem] overflow-hidden shadow-inner border-[6px] border-white">

                {/* Selection pointer (center line) */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 z-20 pointer-events-none shadow" />

                {/* Glass overlay highlight in the center */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-28 bg-white/20 z-10 pointer-events-none backdrop-blur-[1px] border-y border-white/40 shadow-sm" />

                <div
                    className={`flex flex-col w-full transition-transform ease-[cubic-bezier(0.15,0.85,0.15,1)]`}
                    style={{
                        // 30 items -> 3000% total height.
                        // We want item 28 (0-indexed) to end up in the center.
                        // Since our items have the exact same height as the window (h-56/h-64),
                        // translating by 28 item heights puts the 28th item exactly in the window.
                        transform: isSpinning ? `translateY(-${(28 / 30) * 100}%)` : 'translateY(0%)',
                        transitionDuration: isSpinning ? '4000ms' : '0ms'
                    }}
                >
                    {items.map((code, index) => {
                        const cat = CATEGORIES[code];
                        return (
                            <div key={index} className="w-full h-56 sm:h-64 flex-shrink-0 flex items-center justify-center p-4">
                                <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-[1.75rem] flex flex-col items-center justify-center shadow-xl ${cat.color} text-white border-2 border-white/20 relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                    <CategoryIcon code={code} size={56} className="mb-3 relative z-10 drop-shadow-md" />
                                    <span className="font-bold text-lg sm:text-xl relative z-10 drop-shadow-md">{cat.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <p className="mt-8 text-slate-400 font-arabic text-sm sm:text-base animate-pulse">يتم سحب الفئة...</p>
        </div>
    );
};
