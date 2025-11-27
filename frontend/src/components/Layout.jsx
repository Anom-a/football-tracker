import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-b-[3rem] shadow-2xl z-0" />
      
      <div className="relative z-10">
        <nav className="max-w-6xl mx-auto p-6 flex justify-between items-center text-white mb-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter hover:scale-105 transition">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              GOAL<span className="text-yellow-400">TRACKER</span>
            </span>
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="text-sm font-medium hover:text-yellow-300 opacity-90">Live Scores</Link>
            <Link to="/admin" className="text-sm font-medium hover:text-yellow-300 opacity-90">Admin Portal</Link>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 pb-12">
          {children}
        </main>
      </div>
    </div>
  )
}