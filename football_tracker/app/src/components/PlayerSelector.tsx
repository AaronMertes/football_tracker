import { useState } from 'react'
import type { Player } from '../data/models'

interface PlayerSelectorProps {
  players: Player[]
  selectedPlayerId?: string
  onSelectPlayer: (playerId: string | undefined) => void
  playType: 'run' | 'pass'
  team: 'home' | 'away'
  label?: string
  className?: string
}

export default function PlayerSelector({ 
  players, 
  selectedPlayerId, 
  onSelectPlayer, 
  playType, 
  team,
  label = 'Player',
  className = ''
}: PlayerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Filter players by team and suggest relevant positions based on play type
  const relevantPlayers = players.filter(p => p.team === team && p.active)
  
  const selectedPlayer = players.find(p => p.id === selectedPlayerId)
  
  // Suggest relevant positions for the play type
  const getPositionPriority = (position: Player['position']) => {
    if (!position) return 0
    if (playType === 'run') {
      // RBs get highest priority for runs
      if (position === 'RB') return 3
      if (position === 'QB') return 2
      if (position === 'WR' || position === 'TE') return 1
    } else if (playType === 'pass') {
      // QBs get highest priority for passes
      if (position === 'QB') return 3
      if (position === 'WR') return 2
      if (position === 'TE' || position === 'RB') return 1
    }
    return 0
  }
  
  // Sort players by relevance to the play type
  const sortedPlayers = [...relevantPlayers].sort((a, b) => {
    const aPriority = getPositionPriority(a.position)
    const bPriority = getPositionPriority(b.position)
    if (aPriority !== bPriority) return bPriority - aPriority
    return a.name.localeCompare(b.name)
  })

  function handleSelect(playerId: string) {
    onSelectPlayer(playerId)
    setIsOpen(false)
  }

  function handleClear() {
    onSelectPlayer(undefined)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <label className="text-sm text-gray-600">{label}</label>
      
      {/* Selected Player Display */}
      <div className="mt-1">
        {selectedPlayer ? (
          <div className="flex items-center justify-between border rounded px-3 py-2 bg-blue-50">
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedPlayer.name}</span>
              {selectedPlayer.number && (
                <span className="text-sm text-gray-500">#{selectedPlayer.number}</span>
              )}
              {selectedPlayer.position && selectedPlayer.position !== 'Other' && (
                <span className="text-xs bg-blue-200 px-2 py-1 rounded">{selectedPlayer.position}</span>
              )}
            </div>
            <button
              onClick={handleClear}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Clear
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full border rounded px-3 py-2 text-left text-gray-500 hover:border-gray-400"
          >
            Select player...
          </button>
        )}
      </div>

      {/* Player Selection Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 border rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Select {playType === 'run' ? 'Runner' : 'Passer/Receiver'}</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
            
            {sortedPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm p-2">No players available for {team} team.</p>
            ) : (
              <div className="space-y-1">
                {sortedPlayers.map(player => (
                  <button
                    key={player.id}
                    onClick={() => handleSelect(player.id)}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-600">
                        {player.position && player.position !== 'Other' ? player.position : 'No position'}
                        {player.number && ` • #${player.number}`}
                      </div>
                    </div>
                    {getPositionPriority(player.position) > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {playType === 'run' ? 'Run' : 'Pass'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
