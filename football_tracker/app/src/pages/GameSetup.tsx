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
    togglePlayerActive,
    setDefaultQuarterback,
    getDefaultQuarterback
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

      {/* Default Quarterback Section */}
      {currentGame && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Default Quarterback</h2>
          <div className="p-4 border rounded-lg bg-blue-50">
            <p className="text-sm text-gray-700 mb-3">
              Set a default quarterback for passing plays. This QB will automatically be added to all passing plays.
            </p>
            
            {(() => {
              const currentDefault = getDefaultQuarterback(currentGame.id)
              const qbPlayers = currentGame.players.filter(p => 
                p.active && p.position === 'QB' && p.team === 'home'
              )
              
              return (
                <div className="space-y-3">
                  {currentDefault ? (
                    <div className="text-sm">
                      <span className="font-medium">Current Default:</span>{' '}
                      <span className="text-green-600 font-medium">{currentDefault.name}</span>
                      {currentDefault.number && ` (#${currentDefault.number})`}
                    </div>
                  ) : (
                    <div className="text-sm text-yellow-600">
                      ⚠️ No default quarterback set
                    </div>
                  )}
                  
                  {qbPlayers.length > 0 ? (
                    <div>
                      <label className="text-sm text-gray-600">Select Default QB:</label>
                      <div className="flex gap-2 mt-1">
                        {qbPlayers.map(qb => (
                          <button
                            key={qb.id}
                            onClick={() => setDefaultQuarterback(currentGame.id, qb.id)}
                            className={`px-3 py-1 text-sm rounded border ${
                              currentDefault?.id === qb.id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {qb.name} {qb.number && `#${qb.number}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No QB players found. Add a quarterback player first.
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      )}

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

