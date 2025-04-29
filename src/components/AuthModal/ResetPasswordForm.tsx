import { useState, useEffect } from 'react';
import { useResetPassword } from './hooks/useResetPassword';
import ResetEmailInputSection from './interface/resetpassword/ResetEmailInputSection';
import ResetCodeVerifySection from './interface/resetpassword/ResetCodeVerifySection';
import ResetNewPasswordSection from './interface/resetpassword/ResetNewPasswordSection';

interface ResetPasswordFormProps {
  onModeChange: (mode: 'login' | 'register' | 'reset') => void;
}

const ResetPasswordForm = ({ onModeChange }: ResetPasswordFormProps) => {
  const { sendResetCode, verifyResetCode, resetPassword } = useResetPassword();

  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [resetError, setResetError] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

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
      const res = await sendResetCode({ email });
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
      const res = await verifyResetCode({ email, code });
      setToken(res.token);
      setStep(2);
    } catch (err: any) {
      setCodeError(err.response?.data?.error || '인증 실패. 코드를 다시 확인해주세요.');
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResetPassword = async () => {
    setResetError('');
    if (password !== confirmPassword) {
      setResetError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoadingReset(true);
    try {
      await resetPassword({ email, token, new_password: password });
      setResetSuccess(true);
    } catch (err: any) {
      setResetError(err.response?.data?.message || '비밀번호 재설정 실패. 다시 시도해주세요.');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <form className="flex flex-col gap-2 md:gap-4">
      <h2 className="text-2xl font-bold mb-4">Password Reset</h2>

      {step === 1 && (
        <>
          <ResetEmailInputSection
            email={email}
            onChange={setEmail}
            onSendCode={handleSendCode}
            loading={loadingSend}
            error={emailError}
            message={emailMessage}
          />
          <ResetCodeVerifySection
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
        <ResetNewPasswordSection
          password={password}
          confirmPassword={confirmPassword}
          onChangePassword={setPassword}
          onChangeConfirm={setConfirmPassword}
          onSubmit={resetSuccess ? () => onModeChange('login') : handleResetPassword}
          loading={loadingReset}
          error={resetError}
          success={resetSuccess}
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

export default ResetPasswordForm;
