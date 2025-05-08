import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../../store/slices/userSlice';
import { authClient } from './utils/authClient';
import LoginSection from './interface/login/LoginSection';

interface Props {
  onModeChange: (mode: 'login' | 'register' | 'reset') => void;
  onClose: () => void;
}

const LoginForm = ({ onModeChange, onClose }: Props) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await authClient.login({ email, password });
      dispatch(loginAction({
        name: res.name,
        email,
        accessToken: res.access,
      }));
      localStorage.setItem('user', JSON.stringify({
        name: res.name,
        email,
        accessToken: res.access,
      }));
      onClose();
    } catch (err: any) {
      setError(err.message || err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault(); // 기본 제출 방지
            handleLogin();
          }}>
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
        <button onClick={() => onModeChange('reset')} className="text-[#34495E] cursor-pointer hover:underline">Forgot Password</button>
        <button onClick={() => onModeChange('register')} className="text-[#34495E] cursor-pointer hover:underline">Register</button>
      </div>
    </form>
  );
};

export default LoginForm;
