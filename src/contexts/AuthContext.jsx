import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // In a real app, you would make an API call to your authentication endpoint
      // const response = await api.post('/auth/login', { email, password })
      // const { user, token } = response.data
      
      // Mock response for development
      const mockUser = {
        id: '1',
        name: 'Test User',
        email,
        role: 'student',
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', 'mock-jwt-token')
      
      setUser(mockUser)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      // In a real app, you would make an API call to your registration endpoint
      // const response = await api.post('/auth/register', userData)
      
      // Mock response for development
      const mockUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: 'student',
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', 'mock-jwt-token')
      
      setUser(mockUser)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
