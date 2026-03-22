import axios from 'axios'
import { setAccessToken, API_URL } from './axios'

interface AuthResponse { accessToken: string; expiresIn: number }

export async function register(name: string, email: string, password: string, timezone: string) {
  const { data } = await axios.post<AuthResponse>(`${API_URL}/auth/register`,
    { name, email, password, timezone }, { withCredentials: true })
  setAccessToken(data.accessToken)
  return data
}

export async function login(email: string, password: string) {
  const { data } = await axios.post<AuthResponse>(`${API_URL}/auth/login`,
    { email, password }, { withCredentials: true })
  setAccessToken(data.accessToken)
  return data
}

export async function logout() {
  await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
  setAccessToken(null)
}
