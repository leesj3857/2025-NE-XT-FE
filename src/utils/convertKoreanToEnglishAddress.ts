import axios from 'axios';

const JUSO_API_URL = 'https://business.juso.go.kr/addrlink/addrEngApi.do';
const CONFIRM_KEY = import.meta.env.VITE_ADDRESS_KEY;

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
      return null;
    }
  } catch (error) {
    return null;
  }
}
