import { createContext, useState, useEffect, type ReactNode } from 'react'
import axios from 'axios'
import api, { setAccessToken, API_URL } from '../api/axios'
import { logout as apiLogout } from '../api/auth'

interface AuthContextValue {
  isAuthenticated: boolean
  loading: boolean
  userName: string | null
  setUserName: (name: string) => void
  login: (token: string) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false, loading: true, userName: null,
  setUserName: () => {}, login: () => {}, logout: async () => {}
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)

  // On mount: try silent refresh to restore session
  useEffect(() => {
    axios.post<{ accessToken: string }>(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then(({ data }) => {
        setAccessToken(data.accessToken)
        setIsAuthenticated(true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Fetch user name whenever authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      api.get<{ name: string }>('/profile')
        .then(({ data }) => setUserName(data.name))
        .catch(() => {})
    } else {
      setUserName(null)
    }
  }, [isAuthenticated])

  const login = (token: string) => {
    setAccessToken(token)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await apiLogout()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userName, setUserName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
