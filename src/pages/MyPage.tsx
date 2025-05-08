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
const MyPage = () => {
  const { accessToken, name, email, refreshToken } = useSelector((state: RootState) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector((state: RootState) => state.user.name);
  useEffect(() => {
    if(!userName) {
      navigate('/');
    }
  }, [userName]);

  const savedPlaces: Record<string, { color: string; places: PlaceItemType[] }> = {
    Restaurant: {
      color: '#F59E0B',
      places: [
        {
          id:"1678391738",
          placeName:"수작나베 석촌호수직영점",
          addressName:"서울 송파구 석촌동 158-7",
          roadAddressName:"서울 송파구 석촌호수로 234",
          roadAddressNameEN:"234 Seokchonhosu-ro, Songpa-gu, Seoul",
          phone:"02-423-3767",
          categoryName:"음식점 > 퓨전요리 > 퓨전일식",
          categoryNameEN:"Restaurants > Fusion > Fusion Japanese",
          placeUrl:"http://place.map.kakao.com/1678391738",
          categoryGroupCode:"FD6",
          x:"127.102736549521",
          y:"37.5076451940343",
          lat: 37.5665,
          lng: 126.9784,
        },
        {
          id:"1228208521",
          placeName:"청와옥 석촌호수점",
          addressName:"서울 송파구 석촌동 2",
          roadAddressName:"서울 송파구 삼학사로 96",
          roadAddressNameEN:"96 Samhaksa-ro, Songpa-gu, Seoul",
          phone:"02-422-0550",
          categoryName:"음식점 > 한식 > 순대",
          categoryNameEN:"Restaurants > Korean > Sundae",
          placeUrl:"http://place.map.kakao.com/1228208521",
          categoryGroupCode:"FD6",
          x:"127.097458989559",
          y:"37.505703495912",
          lat: 37.5667,
          lng: 126.9786,
        },
      ],
    },
  };


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

  const handleCategoryClick = (category: string) => {
    const categoryData = savedPlaces[category];
    if (categoryData) {
      dispatch(clearOriginPlace());
      dispatch(clearDestinationPlace());
      dispatch(clearRouteInfo());
      dispatch(clearRouteErrorMessage())
      navigate('/mypage/map', { state: { places: categoryData.places } });
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
          handleCategoryClick={handleCategoryClick}
          savedPlaces={savedPlaces}
        />
      </div>

      {/* ✅ 모바일 뷰 */}
      <div className="block md:hidden">
        <CategorySelectionMobile savedPlaces={savedPlaces} handleCategoryClick={handleCategoryClick}/>
      </div>

    </div>
  );
};

export default MyPage;
