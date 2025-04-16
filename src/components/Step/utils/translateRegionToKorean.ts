// src/utils/translateRegionToKorean.ts

import axios from 'axios';

/**
 * 영어 지역명을 한글로 번역하는 함수
 * @param regionEN 영어 지역명
 * @returns 번역된 한글 지역명
 */
export async function translateRegionToKorean(regionEN: string): Promise<string> {
  try {
    const res = await axios.post(
      'https://two025-ne-xt-be.onrender.com/api/translate/region/',
      { text: regionEN }
    );

    return res.data.translated_text;
  } catch (error) {
    console.error('Translation API error:', error);
    return regionEN; // 실패 시 원본 반환
  }
}
