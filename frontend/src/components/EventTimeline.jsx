import { Goal, ShieldAlert, Timer, Flag, CheckCircle2 } from 'lucide-react' // Import CheckCircle2

export function EventTimeline({ events = [] }) {
  const sortedEvents = [...events].reverse()

  // ... (keep empty state check) ...

  return (
    <div className="relative pl-4 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
      
      {sortedEvents.map((ev, index) => {
        const isGoal = ev.type === 'goal'
        const isCard = ev.type === 'card'
        const isWhistle = ev.type === 'whistle' // Check for whistle
        
        return (
          <div key={index} className="relative flex items-start gap-4 animate-in slide-in-from-bottom-2 duration-500 fade-in">
            {/* Timeline Dot/Icon */}
            <div className={`
              relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-sm shrink-0 mt-1
              ${isGoal ? 'bg-green-100 border-green-500 text-green-600' : ''}
              ${isCard ? 'bg-yellow-100 border-yellow-500 text-yellow-600' : ''}
              ${isWhistle ? 'bg-slate-800 border-slate-900 text-white' : ''} 
              ${!isGoal && !isCard && !isWhistle ? 'bg-slate-100 border-slate-400 text-slate-500' : ''}
            `}>
              {isGoal && <div className="text-[10px]">⚽</div>}
              {isCard && <ShieldAlert className="w-3 h-3" />}
              {isWhistle && <CheckCircle2 className="w-3 h-3" />}
              {!isGoal && !isCard && !isWhistle && <Flag className="w-3 h-3" />}
            </div>

            {/* Event Content Card */}
            <div className={`flex-1 p-4 rounded-xl shadow-sm border flex justify-between items-center group hover:shadow-md transition
                ${isWhistle ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-100'}
            `}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isGoal ? 'bg-green-100 text-green-700' : 
                    isWhistle ? 'bg-slate-800 text-white' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ev.type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <h4 className="font-bold text-slate-800 text-lg">
                  {ev.detail}
                </h4>
              </div>
            </div>
          </div>
        )
      })}
      
      {/* ... (keep start indicator) ... */}
    </div>
  )
}