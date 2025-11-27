import { Link } from 'react-router-dom'
import { PlayCircle, Clock } from 'lucide-react'

export function MatchCard({ match }) {
  const isLive = match.status === 'live'

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-slate-100 group">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
            isLive ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {isLive && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />}
            {match.status}
          </span>
          {isLive && <span className="text-xs font-bold text-red-500 animate-pulse">LIVE UPDATES</span>}
        </div>

        <div className="flex justify-between items-center">
          {/* Team A */}
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-2xl mb-2 shadow-inner">
              ⚽
            </div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">{match.team_a}</h3>
          </div>

          {/* Score */}
          <div className="px-6 flex flex-col items-center">
            <div className="text-4xl font-black text-slate-900 bg-slate-50 px-4 py-2 rounded-lg tracking-widest shadow-inner border border-slate-200">
              {match.score_a} - {match.score_b}
            </div>
          </div>

          {/* Team B */}
          <div className="flex-1 text-center">
             <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center text-2xl mb-2 shadow-inner">
              🛡️
            </div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">{match.team_b}</h3>
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <Link to={`/match/${match.id}`} className="block bg-slate-50 p-4 text-center text-sm font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
        {isLive ? <PlayCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        View Match Center
      </Link>
    </div>
  )
}