import { useState } from 'react'
import type { Player, PlayParticipant } from '../data/models'

interface PlayParticipantsProps {
  players: Player[]
  participants: PlayParticipant[]
  onParticipantsChange: (participants: PlayParticipant[]) => void
  playType: 'run' | 'pass'
  className?: string
}

export default function PlayParticipants({ 
  players, 
  participants, 
  onParticipantsChange, 
  playType,
  className = '' 
}: PlayParticipantsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newParticipant, setNewParticipant] = useState<Omit<PlayParticipant, 'playerId'> & { playerId: string }>({
    playerId: '',
    role: 'rusher',
    yards: undefined,
    result: undefined
  })

  const activePlayers = players.filter(p => p.active)
  const homePlayers = activePlayers.filter(p => p.team === 'home')
  const awayPlayers = activePlayers.filter(p => p.team === 'away')

  // Get available roles based on play type
  const getAvailableRoles = () => {
    if (playType === 'run') {
      return ['rusher', 'fumbler', 'recoverer'] as const
    } else {
      return ['passer', 'target', 'receiver', 'interceptor', 'fumbler', 'recoverer'] as const
    }
  }

  const availableRoles = getAvailableRoles()

  function handleAddParticipant() {
    if (!newParticipant.playerId) return

    const participant: PlayParticipant = {
      playerId: newParticipant.playerId,
      role: newParticipant.role,
      yards: newParticipant.yards,
      result: newParticipant.result
    }

    onParticipantsChange([...participants, participant])
    
    // Reset form
    setNewParticipant({
      playerId: '',
      role: 'rusher',
      yards: undefined,
      result: undefined
    })
    setIsAdding(false)
  }

  function handleRemoveParticipant(index: number) {
    const newParticipants = participants.filter((_, i) => i !== index)
    onParticipantsChange(newParticipants)
  }

  function handleUpdateParticipant(index: number, updates: Partial<PlayParticipant>) {
    const newParticipants = participants.map((p, i) => 
      i === index ? { ...p, ...updates } : p
    )
    onParticipantsChange(newParticipants)
  }

  function getPlayerName(playerId: string) {
    return players.find(p => p.id === playerId)?.name || 'Unknown Player'
  }

  function getRoleDescription(role: PlayParticipant['role']) {
    switch (role) {
      case 'passer': return 'QB (Passer)'
      case 'rusher': return 'RB (Rusher)'
      case 'target': return 'WR/TE (Target)'
      case 'receiver': return 'WR/TE (Receiver)'
      case 'interceptor': return 'DB (Interceptor)'
      case 'fumbler': return 'Fumbler'
      case 'recoverer': return 'Recoverer'
      default: return role
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Play Participants</label>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {isAdding ? 'Cancel' : '+ Add Player'}
        </button>
      </div>

      {/* Current Participants */}
      {participants.length > 0 && (
        <div className="space-y-2">
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded bg-gray-50">
              <div className="flex-1">
                <div className="font-medium">{getPlayerName(participant.playerId)}</div>
                <div className="text-sm text-gray-600">{getRoleDescription(participant.role)}</div>
              </div>
              
              <div className="flex items-center gap-2">
                {participant.yards !== undefined && (
                  <input
                    type="number"
                    className="w-16 text-sm border rounded px-2 py-1"
                    placeholder="Yards"
                    value={participant.yards}
                    onChange={(e) => handleUpdateParticipant(index, { yards: Number(e.target.value) })}
                  />
                )}
                
                {participant.result && (
                  <select
                    className="text-sm border rounded px-2 py-1"
                    value={participant.result}
                    onChange={(e) => handleUpdateParticipant(index, { result: e.target.value as PlayParticipant['result'] })}
                  >
                    <option value="complete">Complete</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="intercepted">Intercepted</option>
                    <option value="fumbled">Fumbled</option>
                    <option value="recovered">Recovered</option>
                    <option value="touchdown">Touchdown</option>
                  </select>
                )}
                
                <button
                  onClick={() => handleRemoveParticipant(index)}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Participant Form */}
      {isAdding && (
        <div className="border rounded p-3 bg-blue-50">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Player</label>
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={newParticipant.playerId}
                  onChange={(e) => setNewParticipant({ ...newParticipant, playerId: e.target.value })}
                >
                  <option value="">Select Player</option>
                  <optgroup label="Home Team">
                    {homePlayers.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} {player.position && `(${player.position})`}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Away Team">
                    {awayPlayers.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.name} {player.position && `(${player.position})`}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Role</label>
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={newParticipant.role}
                  onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value as PlayParticipant['role'] })}
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>
                      {getRoleDescription(role)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Yards (optional)</label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="Yards"
                  value={newParticipant.yards || ''}
                  onChange={(e) => setNewParticipant({ ...newParticipant, yards: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Result (optional)</label>
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={newParticipant.result || ''}
                  onChange={(e) => setNewParticipant({ ...newParticipant, result: e.target.value as PlayParticipant['result'] || undefined })}
                >
                  <option value="">No specific result</option>
                  <option value="complete">Complete</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="intercepted">Intercepted</option>
                  <option value="fumbled">Fumbled</option>
                  <option value="recovered">Recovered</option>
                  <option value="touchdown">Touchdown</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddParticipant}
                disabled={!newParticipant.playerId}
                className="bg-blue-600 text-white rounded px-3 py-1 text-sm disabled:opacity-50"
              >
                Add Participant
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="border rounded px-3 py-1 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <strong>Tip:</strong> For passing plays, add the QB as "passer" and the receiver as "receiver". 
        For running plays, add the RB as "rusher". Multiple players can be involved in each play.
      </div>
    </div>
  )
}
