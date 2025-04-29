// src/components/Header.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AuthModal from './AuthModal';
import UserMenu from './User/UserMenu'; // 추가된 사용자 메뉴 컴포넌트

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const userName = useSelector((state: RootState) => state.user.name);

  const goHomePage = () => navigate('/');

  return (
    <header className="bg-[#DCE7EB] text-xl px-6 py-4 flex items-center justify-between relative max-md:h-12 h-16">
      <h1 className="md:text-3xl cursor-pointer" onClick={goHomePage}>
        KOREAT
      </h1>

      <div>
        {userName ? (
          <UserMenu />
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-sm bg-white border rounded-full border-gray-400 px-4 py-1 md:px-5 md:py-2 hover:bg-gray-200 cursor-pointer"
          >
            Login
          </button>
        )}
      </div>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </header>
  );
};

export default Header;
