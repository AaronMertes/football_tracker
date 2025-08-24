import { useState } from 'react'
import type { Player } from '../data/models'

interface PlayerManagerProps {
  players: Player[]
  onAddPlayer: (player: Omit<Player, 'id' | 'metadata'>) => void
  onUpdatePlayer: (playerId: string, updates: Partial<Player>) => void
  onDeletePlayer: (playerId: string) => void
  onToggleActive: (playerId: string) => void
}

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P', 'Other'] as const

export default function PlayerManager({ 
  players, 
  onAddPlayer, 
  onUpdatePlayer, 
  onDeletePlayer, 
  onToggleActive 
}: PlayerManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    team: 'home' as 'home' | 'away',
    number: '',
    position: 'Other' as Player['position'],
    active: true
  })

  const homePlayers = players.filter(p => p.team === 'home' && p.active)
  const awayPlayers = players.filter(p => p.team === 'away' && p.active)
  const inactivePlayers = players.filter(p => !p.active)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (editingId) {
      onUpdatePlayer(editingId, formData)
      setEditingId(null)
    } else {
      onAddPlayer(formData)
    }
    
    setFormData({
      name: '',
      team: 'home',
      number: '',
      position: 'Other',
      active: true
    })
    setIsAdding(false)
  }

  function handleEdit(player: Player) {
    setFormData({
      name: player.name,
      team: player.team,
      number: player.number || '',
      position: player.position || 'Other',
      active: player.active
    })
    setEditingId(player.id)
    setIsAdding(true)
  }

  function handleCancel() {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      name: '',
      team: 'home',
      number: '',
      position: 'Other',
      active: true
    })
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Player Form */}
      {isAdding && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">
            {editingId ? 'Edit Player' : 'Add New Player'}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Name *</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Player name"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Number</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="Jersey number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Team</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value as 'home' | 'away' })}
                >
                  <option value="home">Home Team</option>
                  <option value="away">Away Team</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Position</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as Player['position'] })}
                >
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <label htmlFor="active" className="text-sm text-gray-600">Active player</label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary text-white rounded px-4 py-2"
              >
                {editingId ? 'Update Player' : 'Add Player'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Player Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white rounded px-4 py-2"
        >
          + Add Player
        </button>
      )}

      {/* Player Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Home Team */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Home Team Players</h3>
          <div className="space-y-2">
            {homePlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No home team players added yet.</p>
            ) : (
              homePlayers.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onEdit={() => handleEdit(player)}
                  onDelete={() => onDeletePlayer(player.id)}
                  onToggleActive={() => onToggleActive(player.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Away Team */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-800">Away Team Players</h3>
          <div className="space-y-2">
            {awayPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm">No away team players added yet.</p>
            ) : (
              awayPlayers.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onEdit={() => handleEdit(player)}
                  onDelete={() => onDeletePlayer(player.id)}
                  onToggleActive={() => onToggleActive(player.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Inactive Players */}
      {inactivePlayers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-600">Inactive Players</h3>
          <div className="space-y-2">
            {inactivePlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onEdit={() => handleEdit(player)}
                onDelete={() => onDeletePlayer(player.id)}
                onToggleActive={() => onToggleActive(player.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlayerCard({ 
  player, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: { 
  player: Player
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}) {
  return (
    <div className={`border rounded p-3 ${player.active ? 'bg-white' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{player.name}</span>
            {player.number && (
              <span className="text-sm text-gray-500">#{player.number}</span>
            )}
            {player.position && player.position !== 'Other' && (
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{player.position}</span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {player.team === 'home' ? 'Home Team' : 'Away Team'}
            {!player.active && ' • Inactive'}
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Edit
          </button>
          <button
            onClick={onToggleActive}
            className="text-gray-600 hover:text-gray-800 text-sm underline"
          >
            {player.active ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 text-sm underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
