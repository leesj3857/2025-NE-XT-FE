// src/components/AuthModal/RegisterForm.tsx

import { useState, useEffect } from 'react';
import { registerClient } from './hooks/registerClient';
import EmailInputSection from './interface/register/EmailInputSection';
import CodeVerifySection from './interface/register/CodeVerifySection';
import PasswordInputSection from './interface/register/PasswordInputSection';

interface RegisterFormProps {
  onModeChange: (mode: 'login' | 'register' | 'reset') => void;
}

const RegisterForm = ({ onModeChange }: RegisterFormProps) => {
  const { sendVerificationCode, verifyCode, register } = registerClient;

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

    if (!email) {
      setEmailError('Please enter your email.');
      return;
    }

    setLoadingSend(true);

    try {
      const res = await sendVerificationCode(email);
      setEmailMessage(res.message || 'Verification code has been sent to your email.');
      setTimer(300);
    } catch (err: any) {
      setEmailError(err.message || err.response?.data?.error || 'Failed to send email. Please try again.');
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
      setCodeError(err.message || err.response?.data?.error || 'Verification failed. Please double-check the code.');
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setRegisterError('');

    if (!name || !password || !confirmPassword) {
      setRegisterError('Please enter your name and password.');
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    setLoadingRegister(true);
    try {
      await register({ email, name, password, token });
      setRegisterSuccess(true);
    } catch (err: any) {
      setRegisterError(err.message || err.response?.data?.message || 'Register failed. Please try again.');
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
          onSubmit={handleRegister}
          loading={loadingRegister}
          error={registerError}
          success={registerSuccess}
        />
      )}

      <button
        type="button"
        onClick={() => onModeChange('login')}
        className="text-[#34495E] text-sm cursor-pointer hover:underline mt-2 w-fit mx-auto"
      >
        Back to Login
      </button>
    </form>
  );
};

export default RegisterForm;
