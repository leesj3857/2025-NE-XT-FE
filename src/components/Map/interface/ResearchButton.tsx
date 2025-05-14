import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapCenterResearch } from '../utils/mapCenterResearch';
import { motion, AnimatePresence } from 'framer-motion';
import { clearDestinationPlace, clearOriginPlace, clearRouteInfo, clearRouteErrorMessage } from "../../../store/slices/searchSlice.ts";
import { useDispatch } from "react-redux";
import Icon from '@mdi/react';
import { mdiRefresh } from '@mdi/js';

interface Props {
  mapInstance: any;
}

const ResearchButton: FC<Props> = ({ mapInstance }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [isSelecting, setIsSelecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearchClick = () => {
    setIsSelecting((prev) => !prev);
  };

  const handleOptionClick = (type: 'food' | 'sights') => {
    mapCenterResearch(mapInstance, navigate, type);
    dispatch(clearOriginPlace());
    dispatch(clearDestinationPlace());
    dispatch(clearRouteInfo())
    dispatch(clearRouteErrorMessage())
    setIsSelecting(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSelecting(false);
      }
    };

    if (isSelecting) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelecting]);

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
      ref={containerRef}
    >
      <AnimatePresence>
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mb-1 flex gap-2 bg-white border border-gray-300 rounded-md p-2 shadow-md text-xs md:text-sm"
          >
            <button
              onClick={() => handleOptionClick('food')}
              className=" px-3 py-1 rounded bg-[#cbcccc] text-black font-semibold hover:bg-[#2d3433] hover:text-white transition cursor-pointer text-nowrap"
            >
              Food spots
            </button>
            <button
              onClick={() => handleOptionClick('sights')}
              className=" px-3 py-1 rounded bg-[#cbcccc] text-black font-semibold hover:bg-[#2d3433] hover:text-white transition cursor-pointer text-nowrap"
            >
              Places to visit
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleSearchClick}
        className="bg-[#2D3433] text-white text-xs md:text-sm px-4 py-2 rounded-md shadow-md hover:bg-[#1A1E1D] transition-all cursor-pointer flex items-center gap-1"
      >
        <Icon path={mdiRefresh} size={0.7} />
        Search this area
      </button>
    </div>
  );
};

export default ResearchButton;
