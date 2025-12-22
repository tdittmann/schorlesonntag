import { BackendClient } from '@/services/BackendClient.ts'

interface DrinkJson {
  created: string
  type: 'Normales Schorle' | 'Ochsenschorle'
  deleted: string
}

interface ParticipantJson {
  id: string
  name: string
  target_schorle: string
  dnf: number
  geschlecht: string
  team: string
  drinks: DrinkJson[]
}

export interface Drink {
  created: Date
  type: 'Normales Schorle' | 'Ochsenschorle'
  deleted: boolean
}

export interface Participant {
  id: string
  name: string
  target_schorle: number
  dnf: boolean
  geschlecht: 'm' | 'w' | undefined
  team: string
  drinks: Drink[]
}

const toParticipant = (json: ParticipantJson) => {
  return {
    id: json.id,
    name: json.name,
    target_schorle: Number(json.target_schorle),
    dnf: json.dnf === 1,
    geschlecht: json.geschlecht,
    team: json.team,
    drinks: json.drinks.map(toDrinks),
  } as Participant
}

const toDrinks = (json: DrinkJson) => {
  return {
    created: new Date(json.created),
    deleted: json.deleted === '1',
    type: json.type,
  } as Drink
}

const loadParticipants = (year: number) => {
  return BackendClient.fetchData<ParticipantJson[]>(`/participants?year=${year}`).then((value) => {
    return value.map(toParticipant)
  })
}

export const ParticipantService = {
  loadParticipants,
}
