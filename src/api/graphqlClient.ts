import axios from 'axios';

// const GRAPHQL_API_URL = 'http://neeeext-env.eba-bup7qc4v.ap-northeast-2.elasticbeanstalk.com/graphql/';
const GRAPHQL_API_URL =  import.meta.env.MODE === 'development'
? 'http://neeeext-env.eba-bup7qc4v.ap-northeast-2.elasticbeanstalk.com/graphql/' // 또는 개발용 실제 서버 주소
: '/api/'; // 프로덕션에서는 Netlify 프록시 경로 사용

export const graphqlRequest = async (
  query: string,
  variables: object = {},
  token?: string
) => {
  try {
    const res = await axios.post(
      GRAPHQL_API_URL,
      { query, variables },
      {
        headers: token
          ? { Authorization: `JWT ${token}` }
          : undefined
      }
    );

    if (res.data.errors) {
      throw new Error(res.data.errors[0].message);
    }
    return res.data.data;
  } catch (err: any) {
    throw new Error( err.message || err.response?.data?.errors?.[0]?.message || err.message);
  }
};
