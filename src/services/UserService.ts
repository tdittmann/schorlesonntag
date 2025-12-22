import { BackendClient } from '@/services/BackendClient.ts'

interface UserJson {
  id: string
  name: string
  target_schorle: string
  geschlecht: string
  team: string
}

export interface User {
  id: string
  name: string
  target_schorle: number
  geschlecht: 'm' | 'w' | ''
  team: string
}

const toUser = (json: UserJson) => {
  return {
    id: json.id,
    name: json.name,
    target_schorle: Number(json.target_schorle),
    geschlecht: json.geschlecht,
    team: json.team,
  } as User
}

const toUserJson = (value: User) => {
  return {
    id: value.id,
    name: value.name,
    target_schorle: value.target_schorle.toString(10),
    geschlecht: value.geschlecht,
    team: value.team,
  } as UserJson
}

const loadUser = (id: string) => {
  return BackendClient.fetchData<UserJson>(`/user?id=${id}`)
    .then((value) => {
      return toUser(value)
    })
    .catch(() => {
      return undefined
    })
}

const createUser = (user: User) => {
  return BackendClient.fetchData<UserJson>('/user', 'POST', toUserJson(user))
}

const updateUser = (user: User) => {
  return BackendClient.fetchData<UserJson>('/user', 'PUT', toUserJson(user))
}

export const UserService = {
  loadUser,
  createUser,
  updateUser,
}
