// src/utils/withAuthHandling.ts
import { graphqlRequest } from './graphqlClient';

const VERIFY_TOKEN_QUERY = `
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

const REFRESH_TOKEN_QUERY = `
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      token
      payload
      refreshExpiresIn
    }
  }
`;

/**
 * accessToken을 검증하고 필요시 refreshToken으로 갱신한 뒤 안전하게 GraphQL 요청을 수행
 */
export const tokenVerify = async (
  accessToken: string,
  refreshToken: string
): Promise<string> => {
  try {
    await graphqlRequest(VERIFY_TOKEN_QUERY, { token: accessToken }, accessToken);
    return accessToken; // 유효하므로 그대로 반환
  } catch {
    try {
      const res = await graphqlRequest(REFRESH_TOKEN_QUERY, { token: refreshToken });
      return res.refreshToken.token; // 갱신 성공 시 새 토큰 반환
    } catch (err) {
      throw new Error('토큰 검증 및 갱신 실패. 다시 로그인해주세요.');
    }
  }
};
