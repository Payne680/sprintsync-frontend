import axios from 'axios'

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
axios.defaults.baseURL = API_BASE_URL

// Auth endpoints
export const login = async (email, password) => {
  try {
    console.log('Attempting login to:', `${API_BASE_URL}/api/auth/login`)
    console.log('Login data:', { email, password: '***' })

    const response = await axios.post('/api/auth/login', {
      email,
      password,
    })

    console.log('Login response:', response.data)
    const { token, user } = response.data

    // Store token in localStorage
    localStorage.setItem('authToken', token)

    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    return { token, user }
  } catch (error) {
    console.error('Login error:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)

    // Temporary fallback for testing (remove when backend is ready)
    if (error.response?.data?.error === 'Route not found') {
      console.log('Backend not ready, using mock login for demo')
      const mockUser = {
        id: 1,
        name: 'Demo User',
        email: email,
      }
      const mockToken = 'demo-token-' + Date.now()

      localStorage.setItem('authToken', mockToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`

      return { token: mockToken, user: mockUser }
    }

    throw new Error(error.response?.data?.message || 'Login failed')
  }
}

export const signup = async (name, email, password) => {
  try {
    console.log('Attempting signup to:', `${API_BASE_URL}/api/auth/signup`)
    console.log('Signup data:', { name, email, password: '***' })

    const response = await axios.post('/api/auth/signup', {
      name,
      email,
      password,
    })

    console.log('Signup response:', response.data)
    const { token, user } = response.data

    // Store token in localStorage
    localStorage.setItem('authToken', token)

    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    return { token, user }
  } catch (error) {
    console.error('Signup error:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)

    // Check if it's a "Route not found" error (backend not implemented yet)
    if (error.response?.data?.error === 'Route not found') {
      // Temporary mock response for testing frontend
      console.log('Backend auth not implemented yet, using mock response')

      const mockUser = {
        id: Date.now(),
        name: name,
        email: email,
      }
      const mockToken = 'mock-jwt-token-' + Date.now()

      // Store token in localStorage
      localStorage.setItem('authToken', mockToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`

      return { token: mockToken, user: mockUser }
    }

    throw new Error(error.response?.data?.message || 'Signup failed')
  }
}

export const logout = () => {
  localStorage.removeItem('authToken')
  delete axios.defaults.headers.common['Authorization']
}

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken')
    console.log('getCurrentUser: token found:', !!token)

    if (!token) {
      return null
    }

    // Set authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // For testing, if it's a demo token, return mock user
    if (token.startsWith('demo-token-') || token.startsWith('mock-jwt-token-')) {
      console.log('getCurrentUser: returning mock user for demo token')
      return {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
      }
    }

    try {
      const response = await axios.get('/api/auth/me')
      return response.data.user
    } catch (error) {
      // If backend returns 404 (route not found), fallback to mock user for dev/demo
      if (error.response?.status === 404 || error.response?.data?.error === 'Route not found') {
        console.log('getCurrentUser: /api/auth/me not found, returning mock user for dev')
        return {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
        }
      }
      // For other errors, treat as invalid token
      console.log('getCurrentUser: error fetching user, removing token')
      localStorage.removeItem('authToken')
      delete axios.defaults.headers.common['Authorization']
      return null
    }
  } catch (error) {
    // Defensive: should not reach here, but just in case
    localStorage.removeItem('authToken')
    delete axios.defaults.headers.common['Authorization']
    return null
  }
}

// Initialize auth on app start
export const initializeAuth = () => {
  const token = localStorage.getItem('authToken')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}
