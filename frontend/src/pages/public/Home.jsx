import { useMatchStream } from '../../hooks/useMatchStream'
import { Layout } from '../../components/Layout'
import { MatchCard } from '../../components/MatchCard'

export function Home() {
  const { matches } = useMatchStream()

  return (
    <Layout>
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">
          Matchday Live
        </h1>
        <p className="text-blue-100 text-lg">Real-time scores from around the league</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
          <p className="text-slate-400 text-xl font-medium">No matches scheduled today.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </Layout>
  )
}