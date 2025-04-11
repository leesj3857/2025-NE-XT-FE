import { motion } from 'framer-motion';
import {useDispatch} from "react-redux";
import { setSelectedPlaceId } from '../../../store/slices/searchSlice.ts'
import { PlaceItemType } from "../../../types/place/type.ts";
import { getCategoryIcon } from "../utils/getCategoryIcon.ts";

type PlaceItemProps = PlaceItemType & { index: number };


export default function PlaceItem({
                                    id,
                                    placeName,
                                    roadAddressName,
                                    phone,
                                    categoryName,
                                    placeUrl,
                                    categoryGroupCode,
                                    index,
                                  }: PlaceItemProps) {

  const iconSrc = getCategoryIcon(categoryName, categoryGroupCode);
  const dispatch = useDispatch()

  return (
    <motion.li
      key={id}
      className="bg-[#E9F1F4] p-4 rounded-xl flex items-start justify-between gap-2 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => {dispatch(setSelectedPlaceId(id));}}
    >
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
    </motion.li>
  );
}