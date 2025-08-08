export type UUID = string

export interface GameMetadata {
  createdAt: string
  updatedAt: string
}

export interface PlayerStats {
  playerId: UUID
  rushingAttempts: number
  rushingYards: number
  passingAttempts: number
  passingCompletions: number
  passingYards: number
  interceptions: number
}

export interface FieldPosition {
  yardLine: number
  side: 'home' | 'away'
  hash?: 'left' | 'middle' | 'right'
}

export type PlayResult = 'touchdown' | 'field_goal' | 'punt' | 'turnover' | 'safety' | 'none'

export interface Play {
  id: UUID
  gameId: UUID
  playNumber: number
  formation: string
  playType: 'run' | 'pass'
  yards: number
  result: PlayResult
  fieldPosition: FieldPosition
  down: number
  distance: number
  playerStats: PlayerStats[]
  timestamp: string
}

export interface Game {
  id: UUID
  homeTeam: string
  awayTeam: string
  date: string
  plays: Play[]
  players: { id: UUID; name: string; team: 'home' | 'away' }[]
  metadata: GameMetadata
}

