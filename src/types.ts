export type KakaoPlaceSearchParams = {
  query: string;                     // 필수
  category_group_code?: string;     // 예: FD6
  x?: string;                        // 중심 경도
  y?: string;                        // 중심 위도
  radius?: number;                  // 반경 (0 ~ 20000)
  page?: number;                    // 페이지 번호
  size?: number;                    // 결과 수
  sort?: 'accuracy' | 'distance';   // 정렬 기준
} | undefined;
