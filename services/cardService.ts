
import { Card, CategoryCode } from '../types';
import { WORD_BANK } from '../data/wordBank';
import { CATEGORIES } from '../constants';

/**
 * Serviço de Cartas (Offline/Local)
 * Busca palavras do banco de dados local fornecido pelo usuário.
 */

export const generateCard = async (categoryCode: CategoryCode, excludeWords: string[] = []): Promise<Card> => {
  // Normalização para comparação eficiente
  const exclusionSet = new Set(excludeWords.map(w => w.toLowerCase().trim()));

  // 1. Filtrar palavras do banco pela categoria solicitada
  const categoryWords = WORD_BANK.filter(item => item.category === categoryCode);

  // 2. Remover palavras que já foram usadas recentemente (Histórico)
  const availableWords = categoryWords.filter(item => {
    const wordKey = item.word_pt.toLowerCase().trim();
    return !exclusionSet.has(wordKey);
  });

  // 3. Seleção
  let selected;
  if (availableWords.length > 0) {
    // Escolhe aleatoriamente das palavras disponíveis
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    selected = availableWords[randomIndex];
  } else if (categoryWords.length > 0) {
    // Fallback: Se todas as palavras da categoria já foram usadas,
    // resetamos o filtro para esta categoria específica para não travar o jogo.
    const randomIndex = Math.floor(Math.random() * categoryWords.length);
    selected = categoryWords[randomIndex];
  } else {
    // Segurança extrema caso a categoria esteja vazia no banco
    selected = { category: categoryCode, word_pt: "Erro: Banco Vazio", word_ar: "خطأ" };
  }

  // 4. Mapeamento para o formato interno do App
  const categoryDefinition = CATEGORIES[categoryCode];
  
  return {
    category_code: categoryCode,
    category_name: {
      pt: categoryDefinition.label,
      ar: categoryCode === 'P' ? 'شخص/مكان/حيوان' : 
          categoryCode === 'O' ? 'شيء' : 
          categoryCode === 'A' ? 'فعل' : 
          categoryCode === 'D' ? 'صعب' : 
          categoryCode === 'L' ? 'ترفيه' : 'الجميع يلعب'
    },
    word: {
      pt: selected.word_pt,
      ar: selected.word_ar,
      phonetic: "" // Removido pois o banco fornecido não contém fonética
    },
    difficulty_score: categoryCode === 'D' ? 5 : 1,
    is_all_play: categoryCode === 'T'
  };
};

// Função mantida por compatibilidade de interface, mas agora é no-op
export const prefetchCategory = async () => {};
