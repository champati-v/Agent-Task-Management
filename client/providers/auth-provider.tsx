'use client'

import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { AuthContextValue, User } from '@/types/auth'
import { authService } from '@/lib/services/auth-service'
import { useRouter } from 'next/navigation'

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const hasInitialized = useRef(false)

  const fetchCurrentUser = useCallback(async () => {
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    return currentUser
  }, [])

  useEffect(() => {
    if (hasInitialized.current) {
      return
    }

    hasInitialized.current = true

    const initAuth = async () => {
      try {
        await fetchCurrentUser()
      } catch (error) {
        console.error('Failed to get current user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void initAuth()
  }, [fetchCurrentUser])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await authService.login(email, password)

      if (!response.success) {
        throw new Error(response.message || 'Login failed')
      }

      const currentUser = await fetchCurrentUser()
      if (!currentUser) {
        throw new Error('Unable to load authenticated user')
      }

      router.replace('/')
    } finally {
      setIsLoading(false)
    }
  }, [fetchCurrentUser, router])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
      setUser(null)
      router.replace('/login')
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
