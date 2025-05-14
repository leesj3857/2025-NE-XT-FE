import queryString from 'query-string';
import { NavigateFunction } from 'react-router-dom';


export const mapCenterResearch = (
  mapInstance: any,
  navigate: NavigateFunction,
  selected: 'food' | 'sights'
) => {
  if (!mapInstance) return;

  const center = mapInstance.getCenter();
  const x = center.lng();
  const y = center.lat();

  const query = queryString.stringify({
    type: 'coord',
    x,
    y,
    food: selected === 'food' ? true : undefined,
    sights: selected === 'sights' ? true : undefined,
  });


  navigate(`/map?${query}`);
};
