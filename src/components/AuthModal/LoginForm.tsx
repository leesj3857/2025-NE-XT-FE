import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../../store/slices/userSlice';
import { useAuth } from './hooks/useAuth';
import LoginSection from './interface/login/LoginSection';

interface Props {
  onModeChange: (mode: 'login' | 'register' | 'reset') => void;
  onClose: () => void;
}

const LoginForm = ({ onModeChange, onClose }: Props) => {
  const dispatch = useDispatch();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      dispatch(loginAction({
        name: res.name,
        email,
        accessToken: res.access,
        refreshToken: res.refresh,
      }));
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인 실패. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <LoginSection
        email={email}
        password={password}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
      <div className="flex justify-between text-sm">
        <button onClick={() => onModeChange('reset')} className="text-[#1A1E1D] cursor-pointer hover:underline">Forgot Password</button>
        <button onClick={() => onModeChange('register')} className="text-[#1A1E1D] cursor-pointer hover:underline">Register</button>
      </div>
    </form>
  );
};

export default LoginForm;
