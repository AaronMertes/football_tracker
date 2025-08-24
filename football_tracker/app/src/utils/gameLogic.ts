import type { FieldPosition, PlayResult } from '../data/models'

export interface GameSituation {
  down: number
  distance: number
  fieldPosition: FieldPosition
}

export interface NextPlaySuggestion extends GameSituation {
  isNewSeries: boolean
  seriesReason?: 'first_down' | 'touchdown' | 'turnover' | 'punt' | 'field_goal' | 'safety'
}

/**
 * Calculate the next play situation based on the current play result
 */
export function calculateNextPlay(
  currentSituation: GameSituation,
  playResult: {
    yards: number
    result: PlayResult
    playType: 'run' | 'pass'
  }
): NextPlaySuggestion {
  const { down, distance, fieldPosition } = currentSituation
  const { yards, result } = playResult

  // Handle scoring plays
  if (result === 'touchdown') {
    return {
      down: 1,
      distance: 10,
      fieldPosition: { yardLine: 20, side: 'home' }, // Assume kickoff return position
      isNewSeries: true,
      seriesReason: 'touchdown'
    }
  }

  if (result === 'field_goal') {
    return {
      down: 1,
      distance: 10,
      fieldPosition: { yardLine: 20, side: 'home' }, // Assume kickoff return position
      isNewSeries: true,
      seriesReason: 'field_goal'
    }
  }

  if (result === 'safety') {
    return {
      down: 1,
      distance: 10,
      fieldPosition: { yardLine: 20, side: 'home' }, // Safety punt return position
      isNewSeries: true,
      seriesReason: 'safety'
    }
  }

  // Handle turnovers
  if (result === 'turnover') {
    const newPosition = calculateNewFieldPosition(fieldPosition, yards)
    return {
      down: 1,
      distance: 10,
      fieldPosition: flipFieldPosition(newPosition), // Opponent's ball now
      isNewSeries: true,
      seriesReason: 'turnover'
    }
  }

  // Handle punts
  if (result === 'punt') {
    // For punts, yards represents the net punt (punt distance minus return)
    // Calculate where the ball ends up after the punt
    let puntEndPosition: FieldPosition
    
    if (yards === 0) {
      // No net gain on punt, use default 35-yard net punt
      const netPunt = 35
      puntEndPosition = calculateNewFieldPosition(fieldPosition, netPunt)
    } else {
      // Use the yards as net punt distance
      puntEndPosition = calculateNewFieldPosition(fieldPosition, yards)
    }
    
    // Flip possession to the receiving team
    const receivingTeamPosition = flipFieldPosition(puntEndPosition)
    
    return {
      down: 1,
      distance: 10,
      fieldPosition: receivingTeamPosition,
      isNewSeries: true,
      seriesReason: 'punt'
    }
  }

  // Normal play progression
  const newPosition = calculateNewFieldPosition(fieldPosition, yards)
  
  // Check for first down FIRST (before checking turnover on downs)
  // Debug: console.log(`Checking first down: ${yards} yards >= ${distance} distance?`, yards >= distance)
  if (yards >= distance) {
    return {
      down: 1,
      distance: 10,
      fieldPosition: newPosition,
      isNewSeries: true,
      seriesReason: 'first_down'
    }
  }

  // Check for turnover on downs (only if didn't get first down)
  if (down >= 4) {
    return {
      down: 1,
      distance: 10,
      fieldPosition: flipFieldPosition(newPosition),
      isNewSeries: true,
      seriesReason: 'turnover'
    }
  }

  // Continue current series
  const newDistance = Math.max(0, distance - yards) // Can be 0 yards to go
  return {
    down: down + 1,
    distance: newDistance,
    fieldPosition: newPosition,
    isNewSeries: false
  }
}

/**
 * Calculate new field position after a play
 */
function calculateNewFieldPosition(currentPosition: FieldPosition, yards: number): FieldPosition {
  const { yardLine, side } = currentPosition
  
  let newYardLine: number
  let newSide: 'home' | 'away' = side

  if (side === 'home') {
    // Moving toward opponent's end zone
    newYardLine = yardLine + yards
    if (newYardLine > 50) {
      // Crossed midfield - now on opponent's side
      newYardLine = 100 - newYardLine  // Convert to opponent's yard line
      newSide = 'away'
    } else if (newYardLine <= 0) {
      // Safety or behind own goal line
      newYardLine = Math.max(1, newYardLine)
    }
  } else {
    // On opponent's side, moving toward their end zone  
    newYardLine = yardLine - yards
    if (newYardLine <= 0) {
      // Touchdown or past goal line
      newYardLine = Math.max(1, Math.abs(newYardLine))
    } else if (newYardLine > 50) {
      // Went backwards past midfield - now on own side
      newYardLine = 100 - newYardLine  // Convert to own yard line
      newSide = 'home'
    }
  }

  // Ensure yard line stays in bounds (1-50 for each side)
  newYardLine = Math.max(1, Math.min(50, newYardLine))

  return { yardLine: newYardLine, side: newSide }
}

/**
 * Flip field position for change of possession
 */
function flipFieldPosition(position: FieldPosition): FieldPosition {
  // When possession changes, convert the position to the new team's perspective
  // HOME 20 becomes AWAY 20, AWAY 30 becomes HOME 30, etc.
  return {
    yardLine: position.yardLine,
    side: position.side === 'home' ? 'away' : 'home'
  }
}

/**
 * Format field position for display
 */
export function formatFieldPosition(position: FieldPosition): string {
  const team = position.side === 'home' ? 'HOME' : 'AWAY'
  return `${team} ${position.yardLine}`
}

// Removed unused getDistanceToGoal function

/**
 * Format down and distance for display
 */
export function formatDownDistance(down: number, distance: number): string {
  return `${down}${getOrdinalSuffix(down)} & ${distance}`
}

function getOrdinalSuffix(num: number): string {
  const lastDigit = num % 10
  const lastTwoDigits = num % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th'
  }
  
  switch (lastDigit) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}