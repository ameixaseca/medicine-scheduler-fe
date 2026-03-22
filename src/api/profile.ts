import api from './axios'

export interface UserProfile { name: string; email: string }

export const getProfile = () => api.get<UserProfile>('/profile').then(r => r.data)
export const updateProfile = (body: { name: string }) =>
  api.put<UserProfile>('/profile', body).then(r => r.data)
