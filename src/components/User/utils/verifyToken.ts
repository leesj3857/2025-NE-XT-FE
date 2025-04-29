// src/utils/auth/verifyToken.ts
import axios from 'axios';

export const verifyAccessToken = async (token: string): Promise<boolean> => {
  try {
    await axios.post('https://two025-ne-xt-be.onrender.com/api/token/verify/', { token });
    return true;
  } catch (err) {
    return false;
  }
};
