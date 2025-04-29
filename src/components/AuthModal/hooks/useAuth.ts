import axios from 'axios';
import { LoginPayload } from '../../../types/auth/type';

export const useAuth = () => {
  const login = async (data: LoginPayload) => {
    const res = await axios.post('https://two025-ne-xt-be.onrender.com/api/login/', data);
    return res.data;
  };
  return { login };
};
