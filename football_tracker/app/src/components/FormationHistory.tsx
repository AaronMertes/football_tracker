import type { Play } from '../data/models'
import { analyzeFormationHistory, type FormationStats } from '../utils'

interface FormationHistoryProps {
  plays: Play[]
  className?: string
}

export default function FormationHistory({ plays, className = '' }: FormationHistoryProps) {
  const formationStats = analyzeFormationHistory(plays)

  if (formationStats.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        No formation data yet. Start entering plays to see formation analysis.
      </div>
    )
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-3">Formation Usage</h3>
      <div className="space-y-2">
        {formationStats.map(stats => (
          <FormationStatCard key={stats.formation} stats={stats} />
        ))}
      </div>
    </div>
  )
}

function FormationStatCard({ stats }: { stats: FormationStats }) {
  return (
    <div className="border rounded p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-bold text-primary min-w-[2.5rem]">{stats.formation}</span>
          <span className="text-sm text-gray-600">{stats.count} plays</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{stats.avgYards} avg yards</div>
          <div className="text-xs text-gray-600">{stats.successRate}% success</div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        {stats.runCount} {stats.runCount === 1 ? 'run' : 'runs'} • {stats.passCount} {stats.passCount === 1 ? 'pass' : 'passes'} • {stats.totalYards > 0 ? '+' : ''}{stats.totalYards} total yards
      </div>
      
      {/* Visual usage bar */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, stats.successRate)}%` }}
        />
      </div>
    </div>
  )
}