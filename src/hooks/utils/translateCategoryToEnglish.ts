import axios from 'axios';

const translationCache = new Map<string, string>();

export async function translateCategoryToEnglish(koreanCategory: string): Promise<string> {
  if (translationCache.has(koreanCategory)) {
    return translationCache.get(koreanCategory)!;
  }

  try {
    const res = await axios.post('https://two025-ne-xt-be.onrender.com/api/translate/', {
      text: koreanCategory,
    });

    const translated = res.data.translated_text;
    translationCache.set(koreanCategory, translated);
    return translated;
  } catch (e) {
    console.error('Server translation API error:', e);
    return koreanCategory; // 실패 시 원본 반환
  }
}
