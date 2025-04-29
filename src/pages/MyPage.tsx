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

const MyPage = () => {
  const { accessToken, name, email, refreshToken } = useSelector((state: RootState) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const savedPlaces: Record<string, { color: string; places: string[] }> = {
    Restaurant: { color: '#F59E0B', places: ['Bokseonggak'] }, // Amber-500
    Cafe: { color: '#10B981', places: ['Starbucks', 'Twosome Place'] }, // Emerald-500
    Museum: { color: '#3B82F6', places: ['National Museum of Korea'] }, // Blue-500
    Musseum: { color: '#3B82F6', places: ['National Museum of Korea'] }, // Blue-500
  };

  const dispatch = useDispatch();

  const handleChangeName = async (newName: string) => {
    if (!newName || !accessToken || !email || !refreshToken) return;

    try {
      if (newName === name) return; // 동일한 이름이면 무시

      const updatedName = await updateUserName(newName, accessToken);
      dispatch(login({ name: updatedName, email, accessToken, refreshToken }));

      // ✅ 성공 메시지 토스트 표시
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000); // 2초 뒤 사라짐
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
      await deleteAccount(accessToken);
      dispatch(logout());
      localStorage.removeItem('user');
      alert('Account deleted successfully.');
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };
  return (
    <div className="max-w-[1500px] mx-auto p-6 space-y-10 overflow-y-auto ">
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
      {/* Profile Section */}
      <UserProfile name={name} email={email} onChangeName={handleChangeName} />

      {/* Categories and Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-[#1A1E1D] mb-5">📂 Categories</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
              {Object.entries(savedPlaces).map(([category, { color }]) => {
                const isSelected = selectedCategory === category;

                return (
                  <div
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                                flex flex-col items-center justify-center 
                                rounded-lg cursor-pointer border border-transparent
                                transition duration-200
                                w-[120px] aspect-square p-4
                                ${isSelected ? 'bg-opacity-20' : 'hover:bg-gray-100'}
                              `}
                    style={{
                      backgroundColor: isSelected ? `${color}20` : undefined,
                    }}
                  >
                    <Icon
                      path={mdiFolderOutline}
                      size={3.5}
                      style={{ color }}
                      className="mb-2 transition"
                    />
                    <span className="text-sm font-medium text-[#1A1E1D]">{category}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Places */}
        <div>
          <h3 className="text-lg font-semibold text-[#1A1E1D] mb-5">
            {selectedCategory ? `${selectedCategory} Places` : 'Select a category'}
          </h3>
          {selectedCategory && (
            <div className="flex flex-col gap-4">
              {savedPlaces[selectedCategory].places.map((place) => (
                <div key={place} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
                  <p className="font-medium text-[#1A1E1D]">{place}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Account */}
      <div className="flex justify-end">
        <button
          className="text-red-500 hover:underline text-sm cursor-pointer"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default MyPage;
