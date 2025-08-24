import type { Player, Play } from '../data/models'
import { calculatePlayerStats } from '../utils'
import PlayerStats from './PlayerStats'

interface PlayerStatsListProps {
  players: Player[]
  plays: Play[]
  className?: string
}

export default function PlayerStatsList({ players, plays, className = '' }: PlayerStatsListProps) {
  const activePlayers = players.filter(p => p.active)
  
  if (activePlayers.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        No active players to display statistics for. Add players in Game Setup first.
      </div>
    )
  }

  console.log('PlayerStatsList - Active players:', activePlayers.map(p => ({ id: p.id, name: p.name })))
  console.log('PlayerStatsList - Plays to process:', plays.length)
  if (plays.length > 0) {
    console.log('PlayerStatsList - Sample play:', plays[0])
  }
  
  // Calculate stats for each player
  const playersWithStats = activePlayers.map(player => {
    const stats = calculatePlayerStats(player.id, plays)
    console.log(`PlayerStatsList - Stats for ${player.name} (${player.id}):`, stats)
    return { player, stats }
  }).filter(({ stats }) => {
    const hasStats = stats.rushingAttempts > 0 || stats.passingAttempts > 0 || stats.receivingAttempts > 0 || stats.touchdowns > 0
    console.log(`PlayerStatsList - ${stats.playerId} has stats:`, hasStats, stats)
    return hasStats
  })

  // Sort by total yards (most productive first)
  playersWithStats.sort((a, b) => {
    const aTotal = a.stats.rushingYards + a.stats.passingYards
    const bTotal = b.stats.rushingYards + b.stats.passingYards
    return bTotal - aTotal
  })

  if (playersWithStats.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        No player statistics yet. Start entering plays to see player performance data.
      </div>
    )
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Player Statistics</h3>
      
      {/* Summary Stats */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Game Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {playersWithStats.length}
            </div>
            <div className="text-blue-700">Active Players</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {plays.length}
            </div>
            <div className="text-green-700">Total Plays</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">
              {playersWithStats.reduce((sum, { stats }) => sum + stats.touchdowns, 0)}
            </div>
            <div className="text-purple-700">Touchdowns</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600">
              {playersWithStats.reduce((sum, { stats }) => 
                sum + stats.rushingYards + stats.passingYards, 0
              )}
            </div>
            <div className="text-orange-700">Total Yards</div>
          </div>
        </div>
      </div>

      {/* Individual Player Stats */}
      <div className="space-y-4">
        {playersWithStats.map(({ player, stats }) => (
          <PlayerStats
            key={player.id}
            player={player}
            stats={stats}
          />
        ))}
      </div>

      {/* Players with No Stats */}
      {(() => {
        const playersWithNoStats = activePlayers.filter(player => 
          !playersWithStats.some(p => p.player.id === player.id)
        )

        return playersWithNoStats.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Players Not Yet Involved</h4>
          <div className="text-sm text-gray-600">
            {playersWithNoStats.map(player => (
              <span key={player.id} className="inline-block mr-2 mb-1">
                {player.name}
                {player.position && player.position !== 'Other' && (
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded ml-1">
                    {player.position}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )
      })()}
    </div>
  )
}
