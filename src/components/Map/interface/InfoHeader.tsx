// src/components/Map/interface/InfoHeader.tsx
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  clearOriginPlace,
  clearDestinationPlace,
  clearRouteInfo,
  setSelectedPlaceId
} from "../../../store/slices/searchSlice";
import { mdiClose, mdiCar, mdiClockOutline, mdiMapMarkerDistance } from "@mdi/js";
import Icon from '@mdi/react';
import { motion, AnimatePresence } from "framer-motion";

export default function InfoHeader() {
  const dispatch = useDispatch();
  const { origin, destination, routeInfo } = useSelector(
    (state: RootState) => state.search.selectedPlacePair
  );

  const handleClickPlace = (id:string | undefined) =>{
    if(id){
      dispatch(setSelectedPlaceId(id));
    }
  }

  return (
    <div className="flex justify-between items-start w-full mb-3">
      <h2 className="text-lg md:text-2xl font-bold ">추천 장소</h2>

      <div>
        <div className="flex items-start flex-col max-w-60 min-h-[110px]">
          {/* 출발지/도착지 정보 */}

          <div className="flex flex-col gap-1.5 flex-grow relative">
            {/* 출발지 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3" onClick={() => handleClickPlace(origin?.id)}>
                <div className="w-3 h-3 rounded-full border-2 border-green-600 bg-white shadow-[0_0px_8px_2px_rgba(34,197,94,0.5)]" />
                <span className="text-sm md:text-base text-[#1A1E1D] truncate whitespace-nowrap overflow-hidden w-48">
                {origin?.placeName || "출발지"}
              </span>
              </div>
              {origin && (
                <button
                  onClick={() => {
                    dispatch(clearOriginPlace());
                    dispatch(clearRouteInfo());
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

                <span className="text-sm md:text-base text-[#1A1E1D] truncate whitespace-nowrap overflow-hidden w-48">
                {destination?.placeName || "도착지"}
              </span>
              </div>
              {destination && (
                <button
                  onClick={() => {
                    dispatch(clearDestinationPlace());
                    dispatch(clearRouteInfo());
                  }}
                  className="text-[#2D3433] hover:text-red-500 p-1 cursor-pointer"
                >
                  <Icon path={mdiClose} size={0.8} />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {routeInfo && (
              <motion.div
                className="flex items-center justify-between mt-2 pb-1 border-b-2 border-[#B2BFC2] w-60 text-sm text-[#1A1E1D] font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* 차량 아이콘 */}
                <Icon path={mdiCar} size={0.9} className="text-[#4B5563]" />

                {/* 시간 */}
                <div className="flex items-center gap-1">
                  <Icon path={mdiClockOutline} size={0.7} className="text-[#6B7280]" />
                  <span className="text-[#2D3433]">{Math.round(routeInfo.duration / 60)}분</span>
                </div>

                {/* 거리 */}
                <div className="flex items-center gap-1">
                  <Icon path={mdiMapMarkerDistance} size={0.7} className="text-[#6B7280]" />
                  <span className="text-[#2D3433]">{(routeInfo.distance / 1000).toFixed(1)}km</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
