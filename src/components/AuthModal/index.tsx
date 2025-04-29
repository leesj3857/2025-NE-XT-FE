// src/components/AuthModal/index.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetPasswordForm from './ResetPasswordForm';
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  type AuthMode = 'login' | 'register' | 'reset';
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="fixed inset-0 bg-[#00000078] bg-opacity-30 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-8 max-md:p-6 rounded-lg shadow-lg w-full max-md:max-w-[90%] max-w-md relative "
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#1A1E1D] cursor-pointer"
        >
          <Icon path={mdiClose} size={1}></Icon>
        </button>

        {mode === 'login' && <LoginForm onModeChange={setMode} onClose={onClose} />}
        {mode === 'register' && <RegisterForm onModeChange={setMode} />}
        {mode === 'reset' && <ResetPasswordForm onModeChange={setMode} />}
      </motion.div>
    </div>
  );
};

export default AuthModal;
