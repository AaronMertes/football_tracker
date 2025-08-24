import { useCallback, useMemo, useState } from 'react'
import type { Game, Play, Player, UUID } from '../data/models'
import { StorageService } from '../services/storageService'

const GAMES_KEY = 'games'
const CURRENT_GAME_ID_KEY = 'currentGameId'

function generateId(): UUID {
  return crypto.randomUUID()
}

export function useGameState() {
  const [games, setGames] = useState<Game[]>(() => {
    const raw = StorageService.getItem<Game[]>(GAMES_KEY, [])
    // Backfill for older saved games that may not have currentFieldPosition
    return raw.map((g) =>
      ({
        ...g,
        currentFieldPosition: g.currentFieldPosition ?? { yardLine: 20, side: 'home' },
      } as Game),
    )
  })
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
      currentFieldPosition: { yardLine: 20, side: 'home' },
      metadata: { createdAt: now, updatedAt: now },
    }
    const next = [game, ...games]
    persist(next, game.id)
    return game
  }, [games, persist])

  const addPlayer = useCallback((gameId: UUID, player: Omit<Player, 'id' | 'metadata'>) => {
    const now = new Date().toISOString()
    const newPlayer: Player = {
      ...player,
      id: generateId(),
      metadata: { createdAt: now, updatedAt: now }
    }
    
    const nextGames = games.map((g) =>
      g.id === gameId
        ? {
            ...g,
            players: [...g.players, newPlayer],
            metadata: { ...g.metadata, updatedAt: now },
          }
        : g,
    )
    persist(nextGames, gameId)
    return newPlayer
  }, [games, persist])

  const updatePlayer = useCallback((gameId: UUID, playerId: UUID, updates: Partial<Player>) => {
    const now = new Date().toISOString()
    const nextGames = games.map((g) =>
      g.id === gameId
        ? {
            ...g,
            players: g.players.map((p) =>
              p.id === playerId
                ? { ...p, ...updates, metadata: { ...p.metadata, updatedAt: now } }
                : p,
            ),
            metadata: { ...g.metadata, updatedAt: now },
          }
        : g,
    )
    persist(nextGames, gameId)
  }, [games, persist])

  const deletePlayer = useCallback((gameId: UUID, playerId: UUID) => {
    const nextGames = games.map((g) =>
      g.id === gameId
        ? {
            ...g,
            players: g.players.filter((p) => p.id !== playerId),
            metadata: { ...g.metadata, updatedAt: new Date().toISOString() },
          }
        : g,
    )
    persist(nextGames, gameId)
  }, [games, persist])

  const togglePlayerActive = useCallback((gameId: UUID, playerId: UUID) => {
    const nextGames = games.map((g) =>
      g.id === gameId
        ? {
            ...g,
            players: g.players.map((p) =>
              p.id === playerId
                ? { ...p, active: !p.active, metadata: { ...p.metadata, updatedAt: new Date().toISOString() } }
                : p,
            ),
            metadata: { ...g.metadata, updatedAt: new Date().toISOString() },
          }
        : g,
    )
    persist(nextGames, gameId)
  }, [games, persist])

  const setDefaultQuarterback = useCallback((gameId: UUID, playerId: UUID) => {
    const nextGames = games.map((g) =>
      g.id === gameId
        ? {
            ...g,
            defaultQuarterbackId: playerId,
            metadata: { ...g.metadata, updatedAt: new Date().toISOString() },
          }
        : g,
    )
    persist(nextGames, gameId)
  }, [games, persist])

  const getDefaultQuarterback = useCallback((gameId: UUID): Player | null => {
    const game = games.find(g => g.id === gameId)
    if (!game?.defaultQuarterbackId) return null
    
    return game.players.find(p => p.id === game.defaultQuarterbackId) || null
  }, [games])

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

  const addPlay = useCallback((gameId: UUID, play: Play) => {
    const nextGames = games.map((g) =>
      g.id === gameId
        ? {
            ...g,
            plays: [play, ...g.plays],
            metadata: { ...g.metadata, updatedAt: new Date().toISOString() },
          }
        : g,
    )
    persist(nextGames, gameId)
  }, [games, persist])

  return { 
    games, 
    currentGame, 
    currentGameId, 
    createGame, 
    selectGame, 
    deleteGame, 
    addPlay,
    addPlayer,
    updatePlayer,
    deletePlayer,
    togglePlayerActive,
    setDefaultQuarterback,
    getDefaultQuarterback
  }
}

