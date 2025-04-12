import { FC } from 'react';
import { Icon } from '@mdi/react';
import { mdiCrosshairsGps } from '@mdi/js';
import { moveToUserPosition } from '../utils/moveToUserPosition';

interface Props {
  mapInstance: any;
}

const MoveToMyLocationButton: FC<Props> = ({ mapInstance }) => {
  return (
    <button
      onClick={() => moveToUserPosition(mapInstance)}
      className="absolute bottom-4 right-4 bg-white p-2 md:p-3 shadow-md border
      border-[#2D3433] hover:bg-gray-100 transition cursor-pointer outline-0"
      aria-label="내 위치로 이동"
      style={{ borderRadius: '50%' }}
    >
      <Icon
        path={mdiCrosshairsGps}
        size={0.7}
        className="md:!size-[1.2rem]"
        color="#2D3433"
      />
    </button>
  );
};

export default MoveToMyLocationButton;
