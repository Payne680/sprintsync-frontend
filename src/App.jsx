import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import './styles.css'
import Signup from './pages/Signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1>Dashboard - Coming Soon</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
