import axios from 'axios';

const JUSO_API_URL = 'https://business.juso.go.kr/addrlink/addrEngApi.do';
const CONFIRM_KEY = import.meta.env.VITE_ADDRESS_KEY;

/**
 * 한글 도로명 주소를 영문 주소로 변환
 * @param koreanAddress - 한글 도로명 주소
 * @returns 영문 주소 (문자열) 또는 null
 */
export async function convertKoreanToEnglishAddress(koreanAddress: string): Promise<string | null> {
  try {
    const response = await axios.get(JUSO_API_URL, {
      params: {
        confmKey: CONFIRM_KEY,
        keyword: koreanAddress,
        resultType: 'json',
      },
    });

    const results = response.data?.results?.juso;
    if (Array.isArray(results) && results.length > 0) {
      return results[0].roadAddr || null;
    } else {
      console.warn('주소 검색 결과가 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('주소 변환 에러:', error);
    return null;
  }
}
