
import { CategoryCode, CategoryDefinition } from './types';

export const BOARD_LENGTH = 30;
export const GAME_TITLE = "Al-Mumathil";
export const GAME_SUBTITLE = "O Ator / الْمُمَثِّل";

/**
 * Padrão de 30 casas seguindo as regras:
 * 1. Pelo menos 2 'T' a cada 10 casas.
 * 2. Casas 10, 20 e 30 NÃO são 'D'.
 * 
 * Índices (Posição - 1):
 * 0-9:   [P, O, T, A, L, D, T, P, O, A] (T em 3 e 7, 10 é A)
 * 10-19: [D, L, T, P, O, A, T, L, P, O] (T em 13 e 17, 20 é O)
 * 20-29: [D, A, T, L, P, O, T, P, A, L] (T em 23 e 27, 30 é L)
 */
export const CATEGORY_PATTERN: CategoryCode[] = [
  'P', 'O', 'T', 'A', 'L', 'D', 'T', 'P', 'O', 'A', // 1 a 10
  'D', 'L', 'T', 'P', 'O', 'A', 'T', 'L', 'P', 'O', // 11 a 20
  'D', 'A', 'T', 'L', 'P', 'O', 'T', 'P', 'A', 'L'  // 21 a 30
];

export const CATEGORIES: Record<CategoryCode, CategoryDefinition> = {
  P: {
    code: 'P',
    label: 'Pessoa/Lugar/Animal',
    labelAr: 'شخص/مكان/حيوان',
    color: 'bg-emerald-500',
    description: 'Profissões, Lugares Históricos ou Animais Exóticos',
    descriptionAr: 'المهن، الأماكن التاريخية أو الحيوانات الغريبة',
  },
  O: {
    code: 'O',
    label: 'Objeto',
    labelAr: 'شيء',
    color: 'bg-sky-500',
    description: 'Instrumentos, ferramentas ou artefatos específicos',
    descriptionAr: 'الأدوات، الآلات أو القطع الأثرية المحددة',
  },
  A: {
    code: 'A',
    label: 'Ação',
    labelAr: 'فعل',
    color: 'bg-rose-500',
    description: 'Atividades sofisticadas ou verbos de expressão',
    descriptionAr: 'الأنشطة المعقدة أو الأفعال التعبيرية',
  },
  D: {
    code: 'D',
    label: 'Difícil',
    labelAr: 'صعب',
    color: 'bg-slate-800',
    description: 'Conceitos abstratos ou termos técnicos (Vale 2 casas!)',
    descriptionAr: 'المفاهيم المجردة أو المصطلحات التقنية (تستحق خانتين!)',
  },
  L: {
    code: 'L',
    label: 'Lazer',
    labelAr: 'ترفيه',
    color: 'bg-amber-500',
    description: 'Arte, Gastronomia, Ciência ou Eventos Mundiais',
    descriptionAr: 'الفن، فنون الطهي، العلوم أو الأحداث العالمية',
  },
  T: {
    code: 'T',
    label: 'Todos Jogam',
    labelAr: 'الجميع يلعب',
    color: 'bg-violet-600',
    description: 'Desafio coletivo! Ambos os times tentam adivinhar!',
    descriptionAr: 'تحدي جماعي! يحاول كلا الفريقين التخمين!',
  },
};

export const isAllPlayHouse = (step: number): boolean => {
  if (step === 0) return false;
  return CATEGORY_PATTERN[(step - 1) % CATEGORY_PATTERN.length] === 'T';
};
