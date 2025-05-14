import { graphqlRequest } from '../../../api/graphqlClient';

export async function translateRegionToKorean(regionEN: string): Promise<string> {
  const query = `
    mutation TranslateRegion($text: String!) {
      translateRegionToKorean(text: $text) {
        translatedText
      }
    }
  `;

  try {
    const response = await graphqlRequest(query, { text: regionEN });
    return response.translateRegionToKorean.translatedText;
  } catch (error) {
    console.error('GraphQL Translation API error:', error);
    return regionEN;
  }
}