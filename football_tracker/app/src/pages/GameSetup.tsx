import type { FormEvent } from 'react'
import { useState } from 'react'
import { useGameState } from '../hooks/useGameState'
import PlayerManager from '../components/PlayerManager'

export default function GameSetup() {
  const { 
    games, 
    currentGame, 
    createGame, 
    selectGame, 
    deleteGame,
    addPlayer,
    updatePlayer,
    deletePlayer,
    togglePlayerActive
  } = useGameState()
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')

  function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!homeTeam.trim() || !awayTeam.trim()) return
    createGame(homeTeam.trim(), awayTeam.trim())
    setHomeTeam('')
    setAwayTeam('')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-primary">Game Setup</h1>
      <form className="mt-4 grid gap-3" onSubmit={onCreate}>
        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Home Team</label>
          <input className="border rounded px-3 py-2" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Away Team</label>
          <input className="border rounded px-3 py-2" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} />
        </div>
        <button className="bg-primary text-white rounded px-4 py-2 w-fit" type="submit">Create Game</button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Your Games</h2>
        <ul className="mt-3 divide-y border rounded">
          {games.map((g) => (
            <li key={g.id} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium">{g.homeTeam} vs {g.awayTeam}</div>
                <div className="text-sm text-gray-600">{new Date(g.date).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button className="border rounded px-3 py-1" onClick={() => selectGame(g.id)}>Load</button>
                <button className="border rounded px-3 py-1 text-red-600" onClick={() => deleteGame(g.id)}>Delete</button>
              </div>
            </li>
          ))}
          {games.length === 0 && <li className="p-3 text-gray-600">No games yet.</li>}
        </ul>
        {currentGame && (
          <div className="mt-4 text-sm text-gray-700">Current Game: {currentGame.homeTeam} vs {currentGame.awayTeam}</div>
        )}
      </div>

      {/* Player Management Section */}
      {currentGame && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Player Management</h2>
          <PlayerManager
            players={currentGame.players}
            onAddPlayer={(player) => addPlayer(currentGame.id, player)}
            onUpdatePlayer={(playerId, updates) => updatePlayer(currentGame.id, playerId, updates)}
            onDeletePlayer={(playerId) => deletePlayer(currentGame.id, playerId)}
            onToggleActive={(playerId) => togglePlayerActive(currentGame.id, playerId)}
          />
        </div>
      )}
    </div>
  )
}

