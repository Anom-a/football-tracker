import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Home } from './pages/public/Home'
import { MatchDetails } from './pages/public/MatchDetails'
import { AdminDashboard } from './pages/admin/Dashboard'
import { AdminControlRoom } from './pages/admin/ControlRoom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/match/:id" element={<MatchDetails />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/match/:id" element={<AdminControlRoom />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App