import { BackendClient } from '@/services/BackendClient.ts'

const saveNewDrink = async (userId: string, schorleType: 'Normales Schorle' | 'Ochsenschorle') => {
  await BackendClient.fetchDataAndIgnoreResponse('/drink', 'POST', {
    user_id: userId,
    type: schorleType,
  })
}

export const DrinkService = {
  saveNewDrink,
}
