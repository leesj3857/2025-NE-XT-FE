// src/components/Map/interface/InfoHeader.tsx
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect} from "react";
import { RootState } from "../../../store";
import {
  clearOriginPlace,
  clearDestinationPlace,
  clearRouteInfo,
  setSelectedPlaceId,
  clearRouteErrorMessage
} from "../../../store/slices/searchSlice";
import { mdiClose, mdiCar, mdiClockOutline, mdiMapMarkerDistance, mdiWalk, mdiHelpCircleOutline } from "@mdi/js";
import Icon from '@mdi/react';
import { motion, AnimatePresence } from "framer-motion";
import {useNavigate} from "react-router-dom";

export default function InfoHeader() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLButtonElement | null>(null);
  const { origin, destination, routeInfo, errorMessage } = useSelector(
    (state: RootState) => state.search.selectedPlacePair
  );

  const handleClickPlace = (id:string | undefined) =>{
    if(id){
      dispatch(setSelectedPlaceId(id));
    }
  }
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    }

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  
  return (
    <motion.div
      layout
      className="flex flex-col justify-start items-start w-full mb-3"
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col pr-4">
          <h2 className="text-lg md:text-2xl font-bold ">Top Picks</h2>
          <span className="text-xs md:text-sm text-gray-600 cursor-pointer mt-1" onClick={()=>{navigate('/step')}}>
            Search Again by Keyword
          </span>
        </div>
        <div>
          <div className="flex items-start flex-col ">
            {/* 출발지/도착지 정보 */}

            <div className="flex flex-col gap-1.5 w-full relative">
              {/* 출발지 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" onClick={() => handleClickPlace(origin?.id)}>
                  <div className="w-3 h-3 rounded-full border-2 border-green-600 bg-white shadow-[0_0px_8px_2px_rgba(34,197,94,0.5)]" />
                  <span className={`text-sm md:text-base truncate whitespace-nowrap overflow-hidden max-w-40 ${origin?.placeName ? 'text-[#1A1E1D]' : 'text-gray-400'}`}>
                  {origin?.placeName || "Origin"}
                </span>
                </div>
                {origin && (
                  <button
                    onClick={() => {
                      dispatch(clearOriginPlace());
                      dispatch(clearRouteInfo());
                      dispatch(clearRouteErrorMessage())
                    }}
                    className="text-[#2D3433] hover:text-red-500 p-1 cursor-pointer"
                  >
                    <Icon path={mdiClose} size={0.8} />
                  </button>
                )}
              </div>

              <hr />

              {/* 도착지 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" onClick={() => handleClickPlace(destination?.id)}>
                  <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-white shadow-[0_0px_8px_2px_rgba(239,68,68,0.5)]" />

                  <span className={`text-sm md:text-base truncate whitespace-nowrap overflow-hidden max-w-40 ${destination?.placeName ? 'text-[#1A1E1D]' : 'text-gray-400'}`}>
                  {destination?.placeName || "Destination"}
                </span>
                </div>
                {destination && (
                  <button
                    onClick={() => {
                      dispatch(clearDestinationPlace());
                      dispatch(clearRouteInfo());
                      dispatch(clearRouteErrorMessage())
                    }}
                    className="text-[#2D3433] hover:text-red-500 p-1 cursor-pointer"
                  >
                    <Icon path={mdiClose} size={0.8} />
                  </button>
                )}
              </div>
            </div>


          </div>
        </div>

      </div>

      <AnimatePresence>
        {routeInfo && (
          <motion.div
            layout
            className="flex items-center justify-between my-2 pb-1 text-sm text-[#1A1E1D] font-medium w-full gap-4 mt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b-2 pb-1 border-[#B2BFC2] w-36 relative">
              <Icon path={mdiWalk} size={0.8} className="text-[#4B5563]" />
              <div className="flex items-center gap-1">
                <Icon path={mdiClockOutline} size={0.7} className="text-[#6B7280]" />
                <span className="text-[#2D3433]">{Math.round((routeInfo.distance / 80))} min</span>
                <button
                  ref={tooltipRef}
                  onClick={() => setShowTooltip((prev) => !prev)}
                  className="cursor-pointer focus:outline-none "
                >
                  <Icon path={mdiHelpCircleOutline} size={0.7} className="text-[#9CA3AF] ml-2" />
                </button>

                {/* 툴팁 */}
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[120%] left-0 w-64 bg-[#1A1E1D] text-white text-xs md:text-sm rounded px-3 py-2 shadow z-10"
                    >
                      The walking time is calculated using the vehicle distance and average walking pace, so it may differ from the actual time.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center justify-between border-b-2 pb-1 border-[#B2BFC2] w-48">
              {/* 차량 아이콘 */}
              <Icon path={mdiCar} size={0.8} className="text-[#4B5563]" />

              {/* 시간 */}
              <div className="flex items-center gap-1">
                <Icon path={mdiClockOutline} size={0.7} className="text-[#6B7280]" />
                <span className="text-[#2D3433]">{Math.round(routeInfo.duration / 60)} min</span>
              </div>

              {/* 거리 */}
              <div className="flex items-center gap-1">
                <Icon path={mdiMapMarkerDistance} size={0.7} className="text-[#6B7280]" />
                <span className="text-[#2D3433]">{(routeInfo.distance / 1000).toFixed(1)}km</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            layout
            className="bg-red-50 text-red-700 border border-red-300 rounded-md p-3 py-1.5 text-sm max-md:text-xs w-full mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
