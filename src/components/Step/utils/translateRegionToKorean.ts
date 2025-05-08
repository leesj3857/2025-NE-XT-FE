import axios from 'axios';
import { graphqlRequest } from '../../../api/graphqlClient';
/**
 * 영어 지역명을 한글로 번역하는 함수
 * @param regionEN 영어 지역명
 * @returns 번역된 한글 지역명
 */

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
    return regionEN; // 실패 시 원본 반환
  }
}