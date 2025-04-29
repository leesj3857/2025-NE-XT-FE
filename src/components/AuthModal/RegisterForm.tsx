// src/components/AuthModal/RegisterForm.tsx

import { useState, useEffect } from 'react';
import { useRegister } from './hooks/useRegister';
import EmailInputSection from './interface/register/EmailInputSection';
import CodeVerifySection from './interface/register/CodeVerifySection';
import PasswordInputSection from './interface/register/PasswordInputSection';

interface RegisterFormProps {
  onModeChange: (mode: 'login' | 'register' | 'reset') => void;
}

const RegisterForm = ({ onModeChange }: RegisterFormProps) => {
  const { sendVerificationCode, verifyCode, register } = useRegister();

  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendCode = async () => {
    setEmailError('');
    setEmailMessage('');
    setLoadingSend(true);
    try {
      const res = await sendVerificationCode(email);
      setEmailMessage(res.message || '인증번호가 이메일로 전송되었습니다.');
      setTimer(300);
    } catch (err: any) {
      setEmailError(err.response?.data?.error || '이메일 전송 실패');
    } finally {
      setLoadingSend(false);
    }
  };

  const handleVerifyCode = async () => {
    setCodeError('');
    setLoadingVerify(true);
    try {
      const res = await verifyCode({ email, code });
      setToken(res.token);
      setStep(2);
    } catch (err: any) {
      setCodeError(err.response?.data?.error || '인증 실패. 코드를 다시 확인해주세요.');
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleRegister = async () => {
    setRegisterError('');
    if (password !== confirmPassword) {
      setRegisterError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoadingRegister(true);
    try {
      await register({ email, name, password, token });
      setRegisterSuccess(true);
    } catch (err: any) {
      setRegisterError(err.response?.data?.message || '회원가입 실패. 다시 시도해주세요.');
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <form className="flex flex-col gap-2 md:gap-2">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {step === 1 && (
        <>
          <EmailInputSection
            email={email}
            onChange={setEmail}
            onSendCode={handleSendCode}
            loading={loadingSend}
            error={emailError}
            message={emailMessage}
          />
          <CodeVerifySection
            code={code}
            onChange={setCode}
            onVerify={handleVerifyCode}
            loading={loadingVerify}
            error={codeError}
            timer={timer}
          />
        </>
      )}

      {step === 2 && (
        <PasswordInputSection
          name={name}
          password={password}
          confirmPassword={confirmPassword}
          onChangeName={setName}
          onChangePassword={setPassword}
          onChangeConfirm={setConfirmPassword}
          onSubmit={registerSuccess ? () => onModeChange('login') : handleRegister}
          loading={loadingRegister}
          error={registerError}
          success={registerSuccess}
        />
      )}

      <button
        type="button"
        onClick={() => onModeChange('login')}
        className="text-blue-600 text-sm cursor-pointer hover:underline mt-2"
      >
        Back to Login
      </button>
    </form>
  );
};

export default RegisterForm;
