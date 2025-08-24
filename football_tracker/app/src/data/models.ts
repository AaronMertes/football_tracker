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
  touchdowns: number
  fumbles: number
  fumblesLost: number
}

export interface Player {
  id: UUID
  name: string
  team: 'home' | 'away'
  number?: string
  position?: 'QB' | 'RB' | 'WR' | 'TE' | 'OL' | 'DL' | 'LB' | 'CB' | 'S' | 'K' | 'P' | 'Other'
  active: boolean
  metadata: {
    createdAt: string
    updatedAt: string
  }
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
  primaryPlayerId?: UUID // Main player involved in the play
  timestamp: string
  notes?: string
}

export interface Game {
  id: UUID
  homeTeam: string
  awayTeam: string
  date: string
  plays: Play[]
  players: Player[]
  currentFieldPosition: FieldPosition
  metadata: GameMetadata
}

