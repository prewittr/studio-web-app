// useCurrentLocation.js 
import { useLocation } from 'react-router-dom';

const useCurrentLocation = () => {
  const location = useLocation();
  return location;
};

export default useCurrentLocation;