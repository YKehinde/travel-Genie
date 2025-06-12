import axios from 'axios';

export const fetchPlaces = async (destination: string) => {
  const res = await axios.post('/api/places', { destination });
  return res.data.result;
};
