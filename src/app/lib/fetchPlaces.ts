import axios from 'axios'
import type { Activity } from '@/app/types'

export const fetchPlaces = async (destination: string): Promise<Activity[]> => {
  const res = await axios.post('/api/places', { destination })
  return res.data.activities
}
