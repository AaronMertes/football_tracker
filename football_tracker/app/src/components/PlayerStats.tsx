import type { Player, PlayerStats as PlayerStatsType } from '../data/models'

interface PlayerStatsProps {
  player: Player
  stats: PlayerStatsType
  className?: string
}

export default function PlayerStats({ player, stats, className = '' }: PlayerStatsProps) {
  const rushingAvg = stats.rushingAttempts > 0 ? (stats.rushingYards / stats.rushingAttempts).toFixed(1) : '0.0'
  const passingAvg = stats.passingAttempts > 0 ? (stats.passingYards / stats.passingAttempts).toFixed(1) : '0.0'
  const completionRate = stats.passingAttempts > 0 ? ((stats.passingCompletions / stats.passingAttempts) * 100).toFixed(1) : '0.0'

  return (
    <div className={`border rounded-lg p-4 bg-white ${className}`}>
      {/* Player Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{player.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {player.number && <span>#{player.number}</span>}
            {player.position && player.position !== 'Other' && (
              <span className="bg-gray-200 px-2 py-1 rounded text-xs">{player.position}</span>
            )}
            <span className={player.team === 'home' ? 'text-blue-600' : 'text-red-600'}>
              {player.team === 'home' ? 'Home Team' : 'Away Team'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {stats.rushingYards + stats.passingYards}
          </div>
          <div className="text-xs text-gray-500">Total Yards</div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rushing Stats */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 border-b pb-1">Rushing</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Attempts:</span>
              <span className="font-medium">{stats.rushingAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span>Yards:</span>
              <span className="font-medium">{stats.rushingYards}</span>
            </div>
            <div className="flex justify-between">
              <span>Average:</span>
              <span className="font-medium">{rushingAvg}</span>
            </div>
            <div className="flex justify-between">
              <span>Touchdowns:</span>
              <span className="font-medium">{stats.touchdowns}</span>
            </div>
          </div>
        </div>

        {/* Passing Stats */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 border-b pb-1">Passing</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Attempts:</span>
              <span className="font-medium">{stats.passingAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span>Completions:</span>
              <span className="font-medium">{stats.passingCompletions}</span>
            </div>
            <div className="flex justify-between">
              <span>Yards:</span>
              <span className="font-medium">{stats.passingYards}</span>
            </div>
            <div className="flex justify-between">
              <span>Average:</span>
              <span className="font-medium">{passingAvg}</span>
            </div>
            <div className="flex justify-between">
              <span>Completion %:</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-lg font-semibold text-red-600">{stats.interceptions}</div>
            <div className="text-gray-600">Interceptions</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600">{stats.fumbles}</div>
            <div className="text-gray-600">Fumbles</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-700">{stats.fumblesLost}</div>
            <div className="text-gray-600">Fumbles Lost</div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <div className="text-sm text-gray-700">
          <strong>Performance Summary:</strong> {player.name} has contributed{' '}
          {stats.rushingYards + stats.passingYards} total yards with{' '}
          {stats.rushingAttempts + stats.passingAttempts} total attempts.{' '}
          {stats.touchdowns > 0 && `Scored ${stats.touchdowns} touchdown${stats.touchdowns > 1 ? 's' : ''}.`}
        </div>
      </div>
    </div>
  )
}
