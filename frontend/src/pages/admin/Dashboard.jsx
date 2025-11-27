import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Settings, MonitorPlay } from 'lucide-react'
import { useMatchStream } from '../../hooks/useMatchStream'
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api'

export function AdminDashboard() {
  const { matches } = useMatchStream()
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const navigate = useNavigate()

  const createMatch = async (e) => {
    e.preventDefault()
    if (!teamA || !teamB) return
    await fetch(`${API_BASE_URL}${API_ENDPOINTS.MATCHES}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ team_a: teamA, team_b: teamB })
    })
    setTeamA('')
    setTeamB('')
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" /> Admin Console
            </h1>
            <p className="text-slate-500 mt-1">Manage matches and broadcast events</p>
          </div>
          <button onClick={() => navigate('/')} className="bg-white text-slate-600 px-4 py-2 rounded-lg shadow-sm border hover:bg-slate-50 font-medium">
            View Public Site
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-6">
              <h2 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Create Fixture
              </h2>
              <form onSubmit={createMatch} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Home Team</label>
                  <input value={teamA} onChange={e => setTeamA(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 ring-blue-500 outline-none transition" placeholder="e.g. Manchester City" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Away Team</label>
                  <input value={teamB} onChange={e => setTeamB(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 ring-blue-500 outline-none transition" placeholder="e.g. Liverpool" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all transform active:scale-95">
                  Schedule Match
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-xl text-slate-800 mb-2">Active Fixtures</h2>
            {matches.map(match => (
              <div key={match.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className={`w-2 h-12 rounded-full ${match.status === 'live' ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{match.team_a} vs {match.team_b}</h3>
                    <div className="text-sm text-slate-500 font-medium">
                      Status: <span className="uppercase">{match.status}</span> • Score: {match.score_a}-{match.score_b}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/admin/match/${match.id}`)}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-black transition flex items-center gap-2 shadow-lg shadow-slate-200"
                >
                  <MonitorPlay className="w-4 h-4" /> Control
                </button>
              </div>
            ))}
            {matches.length === 0 && <p className="text-slate-400 text-center py-10">No matches found.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}