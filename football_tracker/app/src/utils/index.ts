export function parsePlayFromText(input: string, players?: Array<{ id: string; name: string; team: 'home' | 'away' }>): {
  formation?: string
  playType?: 'run' | 'pass'
  yards?: number
  result?: 'touchdown' | 'field_goal' | 'punt' | 'turnover' | 'safety' | 'none'
  playerName?: string
  playerId?: string
  notes?: string
} {
  const text = input.trim().toLowerCase()
  const out: {
    formation?: string
    playType?: 'run' | 'pass'
    yards?: number
    result?: 'touchdown' | 'field_goal' | 'punt' | 'turnover' | 'safety' | 'none'
    playerName?: string
    playerId?: string
    notes?: string
  } = { notes: input.trim() }

  if (/\b(run|rush|rushed)\b/.test(text)) out.playType = 'run'
  if (/\b(pass|passed|throw)\b/.test(text)) out.playType = 'pass'

  // Check for incomplete pass first - sets yards to 0
  if (/\b(incomplete|incompl)\b/.test(text)) {
    out.yards = 0
  } else {
    // Look for yards with various patterns
    const yardsMatch = text.match(/(-?\d+)\s*(?:yds|yards|y)/)
    
    // Check for "loss of X" or "lose X" patterns
    const lossMatch = text.match(/(?:loss of|lose|lost)\s+(\d+)/)
    if (lossMatch) {
      out.yards = -Number(lossMatch[1])
    } else if (yardsMatch) {
      out.yards = Number(yardsMatch[1])
    }
    
    // Also check for "gain of X" to be explicit about positive
    const gainMatch = text.match(/(?:gain of|gained|gain)\s+(\d+)/)
    if (gainMatch) {
      out.yards = Number(gainMatch[1])
    }
  }

  if (/touchdown|td\b/.test(text)) out.result = 'touchdown'
  else if (/field goal|fg\b/.test(text)) out.result = 'field_goal'
  else if (/punt/.test(text)) out.result = 'punt'
  else if (/intercept|fumble|turnover/.test(text)) out.result = 'turnover'
  else if (/safety/.test(text)) out.result = 'safety'
  else out.result = 'none'

  const formationMatch = text.match(/\b(11|12|13|20|21|22|02)\b/)
  if (formationMatch) out.formation = formationMatch[1]

  // Player name parsing - look for player names in the text
  if (players && players.length > 0) {
    // Sort players by name length (longest first) to avoid partial matches
    const sortedPlayers = [...players].sort((a, b) => b.name.length - a.name.length)
    
    for (const player of sortedPlayers) {
      const playerNameLower = player.name.toLowerCase()
      // Check if player name appears in the text
      if (text.includes(playerNameLower)) {
        out.playerName = player.name
        out.playerId = player.id
        // Remove player name from notes to avoid duplication
        out.notes = input.trim().replace(new RegExp(player.name, 'gi'), '').trim()
        break
      }
    }
  }

  return out
}

export interface FormationStats {
  formation: string
  count: number
  totalYards: number
  avgYards: number
  runCount: number
  passCount: number
  successRate: number
}

export interface ValidationError {
  field: string
  message: string
}

export function validatePlayData(data: {
  formation: string
  playType: 'run' | 'pass'
  yards: string
  result: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  // Formation validation
  if (!data.formation.trim()) {
    errors.push({ field: 'formation', message: 'Formation is required' })
  } else if (!/^[0-9]{2}$/.test(data.formation.trim()) && !['Goal Line', 'Special'].includes(data.formation.trim())) {
    // Allow standard formations (11, 12, 21, etc.) or special formations
    if (data.formation.trim().length > 20) {
      errors.push({ field: 'formation', message: 'Formation name too long (max 20 characters)' })
    }
  }

  // Yards validation
  if (data.yards !== '' && !Number.isFinite(Number(data.yards))) {
    errors.push({ field: 'yards', message: 'Yards must be a valid number' })
  } else if (Number(data.yards) < -99 || Number(data.yards) > 99) {
    errors.push({ field: 'yards', message: 'Yards must be between -99 and 99' })
  }

  // Result validation
  const validResults = ['touchdown', 'field_goal', 'punt', 'turnover', 'safety', 'none']
  if (!validResults.includes(data.result)) {
    errors.push({ field: 'result', message: 'Invalid play result' })
  }

  return errors
}

export function sanitizePlayData(data: {
  formation: string
  playType: 'run' | 'pass'
  yards: string
  result: string
  notes?: string
}) {
  return {
    formation: data.formation.trim().slice(0, 20),
    playType: data.playType,
    yards: data.yards === '' ? '0' : String(Math.max(-99, Math.min(99, Number(data.yards) || 0))),
    result: data.result,
    notes: data.notes?.trim().slice(0, 200) || undefined
  }
}

export function analyzeFormationHistory(plays: Array<{ formation: string; playType: 'run' | 'pass'; yards: number; result: string }>): FormationStats[] {
  const formationMap = new Map<string, {
    count: number
    totalYards: number
    runCount: number
    passCount: number
    successfulPlays: number
  }>()

  // Aggregate formation data
  plays.forEach(play => {
    if (!play.formation) return
    
    const current = formationMap.get(play.formation) || {
      count: 0,
      totalYards: 0,
      runCount: 0,
      passCount: 0,
      successfulPlays: 0
    }

    current.count++
    current.totalYards += play.yards
    
    if (play.playType === 'run') current.runCount++
    if (play.playType === 'pass') current.passCount++
    
    // Consider successful if positive yards or scoring result
    if (play.yards > 0 || ['touchdown', 'field_goal'].includes(play.result)) {
      current.successfulPlays++
    }

    formationMap.set(play.formation, current)
  })

  // Convert to array and calculate stats
  return Array.from(formationMap.entries())
    .map(([formation, stats]) => ({
      formation,
      count: stats.count,
      totalYards: stats.totalYards,
      avgYards: Math.round((stats.totalYards / stats.count) * 10) / 10,
      runCount: stats.runCount,
      passCount: stats.passCount,
      successRate: Math.round((stats.successfulPlays / stats.count) * 100)
    }))
    .sort((a, b) => b.count - a.count) // Sort by usage frequency
}

export function calculatePlayerStats(
  playerId: string,
  plays: Array<{
    playType: 'run' | 'pass'
    yards: number
    result: string
    primaryPlayerId?: string
  }>
) {
  const stats = {
    playerId,
    rushingAttempts: 0,
    rushingYards: 0,
    passingAttempts: 0,
    passingCompletions: 0,
    passingYards: 0,
    interceptions: 0,
    touchdowns: 0,
    fumbles: 0,
    fumblesLost: 0
  }

  plays.forEach(play => {
    if (play.primaryPlayerId === playerId) {
      if (play.playType === 'run') {
        stats.rushingAttempts++
        stats.rushingYards += play.yards
        if (play.result === 'touchdown') stats.touchdowns++
        if (play.result === 'turnover') stats.fumbles++
      } else if (play.playType === 'pass') {
        stats.passingAttempts++
        if (play.yards > 0) {
          stats.passingCompletions++
          stats.passingYards += play.yards
        }
        if (play.result === 'touchdown') stats.touchdowns++
        if (play.result === 'turnover') stats.interceptions++
      }
    }
  })

  return stats
}


