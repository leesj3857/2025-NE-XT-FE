import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiFolderOutline } from '@mdi/js';
import {useDispatch} from "react-redux";
import {login, logout} from "../store/slices/userSlice.ts";
import UserProfile from "../components/User/interface/UserProfile.tsx";
import {updateUserName, deleteAccount} from "../components/User/utils/user.ts";
import { AnimatePresence, motion } from 'framer-motion';
import {useNavigate} from "react-router-dom";
import CategorySelectionMobile from "../components/User/interface/CategorySelectionMobile.tsx";
import CategorySectionPC from "../components/User/interface/CategorySelectionPC.tsx";
const MyPage = () => {
  const { accessToken, name, email, refreshToken } = useSelector((state: RootState) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const savedPlaces: Record<string, { color: string; places: string[] }> = {
    Restaurant: { color: '#F59E0B', places: ['Bokseonggak'] }, // Amber-500
    Cafe: { color: '#10B981', places: ['Starbucks', 'Twosome Place'] }, // Emerald-500
    Museum: { color: '#3B82F6', places: ['National Museum of Korea'] }, // Blue-500
    Restaurant4Restaurant4Restaurant4: { color: '#F59E0B', places: ['Bokseonggak'] }, // Amber-500
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChangeName = async (newName: string) => {
    if (!newName || !accessToken || !email || !refreshToken) return;

    try {
      if (newName === name) return; // 동일한 이름이면 무시

      const updatedName = await updateUserName(newName, accessToken);
      dispatch(login({ name: updatedName, email, accessToken, refreshToken }));
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        user.name = updatedName;
        localStorage.setItem('user', JSON.stringify(user));
      }
      // ✅ 성공 메시지 토스트 표시
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!accessToken) return;
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteAccount(accessToken);
      dispatch(logout());
      localStorage.removeItem('user');
      navigate('/');
      alert('Account deleted successfully.');
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="max-w-[1500px] mx-auto p-6 space-y-10 overflow-y-auto bg-white">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-xs md:text-sm w-fit whitespace-nowrap"
          >
            Name updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* 프로필 */}
      <UserProfile name={name} email={email} onChangeName={handleChangeName} isDeleting={isDeleting} handleDeleteAccount={handleDeleteAccount} />

      {/* ✅ PC 뷰 */}
      <div className="hidden md:block">
        <CategorySectionPC
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          savedPlaces={savedPlaces}
        />
      </div>

      {/* ✅ 모바일 뷰 */}
      <div className="block md:hidden">
        <CategorySelectionMobile savedPlaces={savedPlaces} />
      </div>

    </div>
  );
};

export default MyPage;
