'use client'

import { createContext, useCallback, useEffect, useState } from 'react'
import { User } from '@/types/auth'
import { authService } from '@/lib/services/auth-service'
import { useRouter } from 'next/navigation'

export const AuthContext = createContext<{
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Failed to get current user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password)
      if (response.success && response.user) {
        setUser(response.user)
        router.push('/')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
