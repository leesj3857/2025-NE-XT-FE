import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../../store";
import { clearSelectedDetailedPlace } from "../../../store/slices/searchSlice.ts";
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

const PlaceDetail = () => {
  const dispatch = useDispatch();
  const place = useSelector((state: RootState) => state.search.selectedDetailedPlace);
  const isMobile = window.innerWidth < 768;
  if (!place) return null;

  return (
    <motion.div
      initial={isMobile ? { y: '-20px', opacity: 0 } : { x: '-20px', opacity: 0 }}
      animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
      exit={isMobile ? { y: '-20px', opacity: 0 } : { x: '-20px', opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: 100 }}
      className="p-4 overflow-auto bg-white shadow-xl rounded-xl
      max-md:fixed max-md:top-1/2 max-md:w-5/6 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:pt-12 max-md:h-[70%]
      md:absolute md:top-1/2 md:-translate-y-1/2 md:left-2 md:w-[380px] md:h-[90%]
      "
    >
      {/* X 버튼 (mdi) */}
      <button
        onClick={() => dispatch(clearSelectedDetailedPlace())}
        className="absolute top-4 right-4 text-gray-400 hover:text-black"
        aria-label="Close detail"
      >
        <Icon path={mdiClose} size={1} />
      </button>

      {/* 상세 정보 내용 */}
      <h2 className="text-xl font-semibold">{place.placeName}</h2>
      <p className="text-sm text-gray-600">{place.roadAddressName}</p>
      <p className="text-sm text-gray-600">{place.phone}</p>
      <p className="text-sm text-gray-500 mt-2">{place.categoryName}</p>
      <a
        href={place.placeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline text-sm mt-4 inline-block"
      >
        상세 정보 보기
      </a>
    </motion.div>
  );
};

export default PlaceDetail;
