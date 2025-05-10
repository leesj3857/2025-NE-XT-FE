import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { mdiFolderOutline } from '@mdi/js';
import {PlaceItemType} from "../types/place/type.ts";
import {useDispatch} from "react-redux";
import {login, logout} from "../store/slices/userSlice.ts";
import UserProfile from "../components/User/interface/UserProfile.tsx";
import {updateUserName, deleteAccount} from "../components/User/utils/user.ts";
import { AnimatePresence, motion } from 'framer-motion';
import {useNavigate} from "react-router-dom";
import CategorySelectionMobile from "../components/User/interface/CategorySelectionMobile.tsx";
import CategorySectionPC from "../components/User/interface/CategorySelectionPC.tsx";
import {clearOriginPlace, clearDestinationPlace, clearRouteErrorMessage, clearRouteInfo} from "../store/slices/searchSlice.ts";
import ToastMessage from "../interface/ToastMessage.tsx";
const MyPage = () => {
  const { accessToken, name, email, refreshToken } = useSelector((state: RootState) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector((state: RootState) => state.user.name);
  useEffect(() => {
    if(!userName) {
      navigate('/');
    }
  }, [userName]);

  const categories = useSelector((state: RootState) => state.user.categories);


  const handleChangeName = async (newName: string) => {
    if (!newName || !accessToken || !email ) return;

    try {
      if (newName === name) return; // 동일한 이름이면 무시

      const updatedName = await updateUserName(newName, accessToken);
      dispatch(login({ name: updatedName, email, accessToken }));
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

    try {
      setIsDeleting(true);
      await deleteAccount(accessToken);
      dispatch(logout());
      localStorage.removeItem('user');
      setShowDeleteToast(true);
      setTimeout(() => {
        setShowDeleteToast(false);
        navigate('/');
      }, 1200);
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

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      dispatch(clearOriginPlace());
      dispatch(clearDestinationPlace());
      dispatch(clearRouteInfo());
      dispatch(clearRouteErrorMessage());
      navigate('/mypage/map', { state: { places: category.places } });
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto p-6 space-y-10 overflow-y-auto bg-white">
      
      <ToastMessage show={showSuccess} message="Name updated successfully!" />
      <ToastMessage show={showDeleteToast} message="Account deleted successfully!" />
      {/* 프로필 */}
      <UserProfile name={name} email={email} onChangeName={handleChangeName} isDeleting={isDeleting} handleDeleteAccount={handleDeleteAccount} />

      {/* ✅ PC 뷰 */}
      <div className="hidden sm:block">
        <CategorySectionPC
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          handleCategoryClick={handleCategoryClick}
        />
      </div>

      {/* ✅ 모바일 뷰 */}
      <div className="block sm:hidden">
        <CategorySelectionMobile handleCategoryClick={handleCategoryClick}/>
      </div>

    </div>
  );
};

export default MyPage;
