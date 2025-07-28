import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import './styles.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1>Login Page - Coming Soon</h1>
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1>Signup Page - Coming Soon</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
