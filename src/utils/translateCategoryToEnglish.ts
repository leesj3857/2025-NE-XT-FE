import { graphqlRequest } from '../api/graphqlClient';
const translationCache = new Map<string, string>();

export async function translateCategoryToEnglish(koreanCategory: string): Promise<string> {
  if (translationCache.has(koreanCategory)) {
    return translationCache.get(koreanCategory)!;
  }

  const query = `
    mutation TranslateCategory($text: String!) {
      translateCategory(text: $text) {
        translatedText
      }
    }
  `;

  try {
    const response = await graphqlRequest(query, { text: koreanCategory });
    const translated = response.translateCategory.translatedText;
    translationCache.set(koreanCategory, translated);
    return translated;
  } catch (e) {
    return koreanCategory;
  }
}