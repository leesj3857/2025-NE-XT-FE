import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../../store/slices/searchSlice';

const StepSummary = ({ city, region, categories, onBack }: {
  city: string;
  region: string;
  categories: { food: boolean; sights: boolean };
  onBack: () => void;
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(setSearchParams({ city, region, categories }));
    setIsSearching(true);
    setTimeout(() => {
      navigate('/map');
    }, 4000);
  };

  return (
    <div className="flex flex-col relative h-full overflow-hidden">
      {!isSearching ? (
        <>
          <h2 className="text-xl md:text-2xl font-bold mb-10">입력한 정보를 확인해 주세요</h2>
          <ul className="mb-10 max-md:text-lg text-xl space-y-3">
            <li><strong>여행 도시 :</strong> {city}</li>
            <li><strong>세부 지역 :</strong> {region}</li>
            <li><strong>선택 항목 :</strong> {categories.food && '맛집'} {categories.food && categories.sights && ' / '} {categories.sights && '볼거리'}</li>
          </ul>
          <div className="flex justify-between max-md:absolute max-md:bottom-0 w-full">
            <button onClick={onBack} className="text-[#2D3433] px-4 py-2 border border-[#2D3433] rounded cursor-pointer w-28">
              이전 단계
            </button>
            <button onClick={handleSearch} className="bg-[#2D3433] text-white px-6 py-2 rounded cursor-pointer w-28">
              찾기
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <motion.div
            initial={{ x: -500 }}
            animate={{ x: [ -500, 550 ] }}
            transition={{ duration: 4 }}
            className="text-4xl mb-6"
          >
            <img src="/airplane.webp" width="150px" alt=""/>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl font-medium"
          >
            해당 장소의 {categories.food && '맛집'}{categories.food && categories.sights && ' / '}{categories.sights && '볼거리'}{categories.sights ? '를' : '을'} 찾으러 가고 있어요!
          </motion.p>
        </div>
      )}
    </div>
  );
};

export default StepSummary;