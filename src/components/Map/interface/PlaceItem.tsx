import { motion } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPlaceId } from '../../../store/slices/searchSlice.ts'
import { PlaceItemType } from "../../../types/place/type.ts";
import { getCategoryIcon } from "../utils/getCategoryIcon.ts";
import { setOriginPlace, setDestinationPlace } from "../../../store/slices/searchSlice";
import {useEffect, useState} from "react";
import { RootState } from "../../../store";

type PlaceItemProps = PlaceItemType & { index: number };


export default function PlaceItem({
                                    id,
                                    placeName,
                                    roadAddressName,
                                    phone,
                                    categoryName,
                                    placeUrl,
                                    categoryGroupCode,
                                    lat,
                                    lng,
                                    index,
                                  }: PlaceItemProps) {

  const iconSrc = getCategoryIcon(categoryName, categoryGroupCode);
  const dispatch = useDispatch()
  const [showDetails, setShowDetails] = useState(false);
  const selectedPlaceId = useSelector((state: RootState) => state.search.selectedPlaceId);

  const handleItemClick = () => {
    dispatch(setSelectedPlaceId(id));
    setShowDetails((prev) => !prev);
  };

  useEffect(()=>{
    if(selectedPlaceId === id){
      setShowDetails(true);
    }
    else{
      setShowDetails(false);
    }
  },[selectedPlaceId]);

  return (
    <motion.li
      key={id}
      id={`place-item-${id}`}
      className="bg-[#E9F1F4] p-4 rounded-xl  cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleItemClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-base"> { placeName } </h3>
          {categoryName && (
            <p className="text-xs text-gray-600"> {categoryName} </p>
          )}
          <p className="text-sm">{roadAddressName}</p>
          {phone && <p className="text-sm text-gray-600">📞 {phone}</p>}
          {placeUrl && (
            <a
              href={placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              카카오에서 보기
            </a>
          )}
        </div>

        {iconSrc && (
          <div className="w-10 h-10 flex-shrink-0">
            <img
              src={iconSrc}
              alt="category icon"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
      {showDetails && (
        <motion.div
          className="bg-white rounded-xl mt-3 shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <div className="p-3 space-y-2">

            {/* 상세정보 보기 (파란 계열) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                // 기능은 추후 정의 예정
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-700 hover:bg-blue-100 cursor-pointer transition"
            >
              <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white shadow-[0_0px_8px_2px_rgba(59,130,246,0.5)]" />
              <span className="text-sm font-medium">상세정보 보기</span>
            </div>

            {/* 출발지 설정 */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setOriginPlace({
                  id, placeName, roadAddressName, phone, categoryName,
                  placeUrl, categoryGroupCode, lat, lng
                }));
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500 text-green-700 hover:bg-green-100 cursor-pointer transition"
            >
              <div className="w-3 h-3 rounded-full border-2 border-green-600 bg-white shadow-[0_0px_8px_2px_rgba(34,197,94,0.5)]" />
              <span className="text-sm font-medium">출발지로 설정</span>
            </div>

            {/* 도착지 설정 */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setDestinationPlace({
                  id, placeName, roadAddressName, phone, categoryName,
                  placeUrl, categoryGroupCode, lat, lng
                }));
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-700  hover:bg-red-100 cursor-pointer transition"
            >
              <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-white shadow-[0_0px_8px_2px_rgba(239,68,68,0.5)]" />
              <span className="text-sm font-medium">도착지로 설정</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.li>
  );
}