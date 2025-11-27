import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Timer } from 'lucide-react'
import { useMatchStream } from '../../hooks/useMatchStream'
import { Layout } from '../../components/Layout'
import { EventTimeline } from '../../components/EventTimeline'

export function MatchDetails() {
  const { id } = useParams()
  const { singleMatch: match } = useMatchStream(id)

  // 1. Loading State
  if (!match) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading Match Data...</p>
        </div>
      </Layout>
    )
  }

  // 2. Main Render
  return (
    <Layout>
      <Link to="/" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      {/* Hero Scoreboard */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-[0.3em] mb-4 flex justify-center items-center gap-2">
            {match.status === 'live' && <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
            {match.status}
          </div>

          <div className="flex justify-center items-center gap-4 md:gap-16">
            <div className="text-center flex-1">
              <div className="text-xl md:text-3xl font-bold text-white mb-2">{match.team_a}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
              <span className="text-4xl md:text-7xl font-black text-white font-mono tracking-tighter">
                {match.score_a}:{match.score_b}
              </span>
            </div>

            <div className="text-center flex-1">
              <div className="text-xl md:text-3xl font-bold text-white mb-2">{match.team_b}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-2xl mx-auto">
        <h3 className="font-bold text-slate-700 text-xl mb-6 flex items-center gap-2 pl-2">
          <Timer className="w-6 h-6 text-blue-600" /> Match Timeline
        </h3>
        
        {/* Pass the events directly to the component */}
        <EventTimeline events={match.events} />
        
      </div>
    </Layout>
  )
}