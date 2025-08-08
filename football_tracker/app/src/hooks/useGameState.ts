import { useCallback, useMemo, useState } from 'react'
import type { Game, UUID } from '../data/models'
import { StorageService } from '../services/storageService'

const GAMES_KEY = 'games'
const CURRENT_GAME_ID_KEY = 'currentGameId'

function generateId(): UUID {
  return crypto.randomUUID()
}

export function useGameState() {
  const [games, setGames] = useState<Game[]>(() =>
    StorageService.getItem<Game[]>(GAMES_KEY, []),
  )
  const [currentGameId, setCurrentGameId] = useState<UUID | null>(() =>
    StorageService.getItem<UUID | null>(CURRENT_GAME_ID_KEY, null),
  )

  const currentGame = useMemo(
    () => games.find((g) => g.id === currentGameId) ?? null,
    [games, currentGameId],
  )

  const persist = useCallback(
    (nextGames: Game[], nextCurrentId: UUID | null = currentGameId) => {
      setGames(nextGames)
      setCurrentGameId(nextCurrentId)
      StorageService.setItem(GAMES_KEY, nextGames)
      StorageService.setItem(CURRENT_GAME_ID_KEY, nextCurrentId)
    },
    [currentGameId],
  )

  const createGame = useCallback((homeTeam: string, awayTeam: string): Game => {
    const now = new Date().toISOString()
    const game: Game = {
      id: generateId(),
      homeTeam,
      awayTeam,
      date: now,
      plays: [],
      players: [],
      metadata: { createdAt: now, updatedAt: now },
    }
    const next = [game, ...games]
    persist(next, game.id)
    return game
  }, [games, persist])

  const selectGame = useCallback((id: UUID) => {
    if (games.some((g) => g.id === id)) {
      persist(games, id)
    }
  }, [games, persist])

  const deleteGame = useCallback((id: UUID) => {
    const next = games.filter((g) => g.id !== id)
    const nextId = currentGameId === id ? (next[0]?.id ?? null) : currentGameId
    persist(next, nextId)
  }, [games, currentGameId, persist])

  return { games, currentGame, currentGameId, createGame, selectGame, deleteGame }
}

