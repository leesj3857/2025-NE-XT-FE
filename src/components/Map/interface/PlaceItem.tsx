import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPlaceId } from '../../../store/slices/searchSlice.ts'
import { PlaceItemType } from "../../../types/place/type.ts";
import { getCategoryIcon } from "../utils/getCategoryIcon.ts";
import { setOriginPlace, setDestinationPlace, setSelectedDetailedPlace } from "../../../store/slices/searchSlice";
import { useEffect, useState } from "react";
import { RootState } from "../../../store";
import Icon from "@mdi/react";
import { mdiContentCopy, mdiBookmarkOutline } from "@mdi/js";
import SavePlaceModal from "./SavePlaceModal";
type PlaceItemProps = PlaceItemType & { index: number };

export default function PlaceItem({ index, ...placeData }: PlaceItemProps) {
  const {
    id,
    placeName,
    roadAddressName,
    roadAddressNameEN,
    phone,
    categoryName,
    categoryNameEN,
    placeUrl,
    categoryGroupCode,
    lat,
    lng,
  } = placeData;
  const iconSrc = getCategoryIcon(categoryName, categoryGroupCode);
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);
  const selectedPlaceId = useSelector((state: RootState) => state.search.selectedPlaceId);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { categories } = useSelector((state: RootState) => state.user); // ⬅ 카테고리 접근
  const currentCategory = categories.find(c =>
    c.places.some(p => p.id === placeData.id)
  );
  const bookmarkColor = currentCategory?.color;
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(placeName).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);
    });
  };

  const handleItemClick = () => {
    dispatch(setSelectedPlaceId(id));
    setShowDetails((prev) => !prev);
  };

  useEffect(() => {
    if (selectedPlaceId === id) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  }, [selectedPlaceId]);
  console.log(placeData);
  return (
    <motion.li
      key={id}
      id={`place-item-${id}`}
      className="bg-white border-2 border-[#B5CC88] p-4 rounded-xl cursor-pointer shadow-md "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleItemClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-start gap-4 relative">
            <h3 className="font-bold text-base">{placeName}</h3>
            <button onClick={handleCopy} className="text-gray-500 hover:text-gray-800 cursor-pointer">
              <Icon path={mdiContentCopy} size={0.8} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSaveModal(true);
              }}
              className="text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <Icon path={mdiBookmarkOutline} size={1} color={bookmarkColor} />
            </button>
            <AnimatePresence>
              {copySuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[120%] right-0 bg-[#1A1E1D] text-white text-xs md:text-sm rounded px-3 py-2 shadow z-10"
                >
                  Copied to clipboard.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {categoryName && (
            <p className="text-xs text-gray-600">{categoryNameEN}</p>
          )}
          <p className="text-sm">{roadAddressNameEN}</p>
          {phone && <p className="text-sm text-gray-600">📞 {phone}</p>}
          {placeUrl && (
            <a
              href={placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              View on Kakao (Korean)
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
          className="bg-white rounded-xl mt-3 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <div className="p-3 space-y-2">

            {/* View Details */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setSelectedDetailedPlace(placeData));
                // To be implemented later
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-700 hover:bg-blue-100 cursor-pointer transition"
            >
              <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white shadow-[0_0px_8px_2px_rgba(59,130,246,0.5)]" />
              <span className="text-sm font-medium">Show Detail</span>
            </div>

            {/* Set as Origin */}
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
              <span className="text-sm font-medium">Set as Origin</span>
            </div>

            {/* Set as Destination */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setDestinationPlace({
                  id, placeName, roadAddressName, phone, categoryName,
                  placeUrl, categoryGroupCode, lat, lng
                }));
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-700 hover:bg-red-100 cursor-pointer transition"
            >
              <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-white shadow-[0_0px_8px_2px_rgba(239,68,68,0.5)]" />
              <span className="text-sm font-medium">Set as Destination</span>
            </div>
          </div>
        </motion.div>
      )}
      {showSaveModal && (
        <SavePlaceModal
          place={placeData}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </motion.li>
  );
}
