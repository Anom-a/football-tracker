import { useParams, Link } from 'react-router-dom'
import { Play, ShieldAlert, Goal, ArrowLeft } from 'lucide-react'
import { useMatchStream } from '../../hooks/useMatchStream'
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api'

export function AdminControlRoom() {
  const { id } = useParams()
  const { singleMatch: match } = useMatchStream(id)

  const sendAction = async (endpoint, body = {}) => {
    const url = endpoint === 'start' 
      ? `${API_BASE_URL}${API_ENDPOINTS.START_MATCH(id)}`
      : `${API_BASE_URL}${API_ENDPOINTS.ADD_EVENT(id)}`
    
    await fetch(url, {
      method: body.detail ? 'POST' : 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
  }

  if (!match) return <div className="p-10 text-center text-slate-500">Connecting to Control Room...</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/admin" className="text-slate-400 hover:text-white mb-8 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Live Status Header */}
        <div className="bg-slate-800 rounded-3xl p-8 mb-8 border border-slate-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Goal size={100} />
          </div>
          <div className="text-center">
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${match.status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
              {match.status}
            </div>
            <div className="flex justify-between items-center text-3xl md:text-5xl font-black">
              <div className="w-1/3 text-right text-slate-300">{match.team_a}</div>
              <div className="w-1/3 bg-black/50 rounded-xl py-4 mx-4 border border-white/10 font-mono text-emerald-400">
                {match.score_a} : {match.score_b}
              </div>
              <div className="w-1/3 text-left text-slate-300">{match.team_b}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        {match.status !== 'live' ? (
          <button 
            onClick={() => sendAction('start')} 
            className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-2xl font-black shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <Play className="w-8 h-8 fill-current" /> START MATCH BROADCAST
          </button>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Team A Panel */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-center font-bold text-xl text-slate-300 mb-6 border-b border-slate-700 pb-3">{match.team_a}</h3>
              <div className="space-y-4">
                <button onClick={() => sendAction('event', { type: 'goal', team: 'A', detail: 'GOAL Scored!' })} 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95">
                  <Goal className="w-5 h-5" /> Goal (+1)
                </button>
                <button onClick={() => sendAction('event', { type: 'card', team: 'A', detail: 'Yellow Card' })} 
                  className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                  <ShieldAlert className="w-5 h-5" /> Issue Card
                </button>
              </div>
            </div>

            {/* Team B Panel */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-center font-bold text-xl text-slate-300 mb-6 border-b border-slate-700 pb-3">{match.team_b}</h3>
              <div className="space-y-4">
                <button onClick={() => sendAction('event', { type: 'goal', team: 'B', detail: 'GOAL Scored!' })} 
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95">
                  <Goal className="w-5 h-5" /> Goal (+1)
                </button>
                <button onClick={() => sendAction('event', { type: 'card', team: 'B', detail: 'Yellow Card' })} 
                  className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                  <ShieldAlert className="w-5 h-5" /> Issue Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}