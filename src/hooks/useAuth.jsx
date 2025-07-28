import { useState, useEffect, createContext, useContext } from 'react'
import { getCurrentUser, initializeAuth } from '../api/auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('useAuth: initializing auth...')
        initializeAuth()
        const currentUser = await getCurrentUser()
        console.log('useAuth: current user:', currentUser)
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to load user:', error)
        setUser(null)
      } finally {
        console.log('useAuth: loading complete')
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const value = {
    user,
    setUser,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
