import axios from 'axios';

const GRAPHQL_API_URL = 'http://neeeext-env.eba-bup7qc4v.ap-northeast-2.elasticbeanstalk.com/graphql/';

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
          ? { Authorization: `Bearer ${token}` }
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
