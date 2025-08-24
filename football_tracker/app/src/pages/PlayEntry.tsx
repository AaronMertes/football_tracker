import { useMemo, useState, useRef, useEffect } from 'react'
import FormationModal from '../components/FormationModal'
import FormationHistory from '../components/FormationHistory'
import PlayerSelector from '../components/PlayerSelector'
import PlayerStatsList from '../components/PlayerStatsList'
import { useGameState } from '../hooks/useGameState'
import { useVoiceInput } from '../hooks/useVoiceInput'
import { parsePlayFromText, validatePlayData, sanitizePlayData, type ValidationError } from '../utils'
import { calculateNextPlay, formatFieldPosition, formatDownDistance, type GameSituation } from '../utils/gameLogic'
import type { FieldPosition, Play } from '../data/models'

function nextPlayNumber(existing: Play[]): number {
  return (existing[0]?.playNumber ?? 0) + 1
}

export default function PlayEntry() {
  const { currentGame, currentGameId, addPlay } = useGameState()
  const [isFormationOpen, setFormationOpen] = useState(false)
  const [formation, setFormation] = useState('')
  const [playType, setPlayType] = useState<'run' | 'pass'>('run')
  const [yardsText, setYardsText] = useState('')
  const [result, setResult] = useState<'touchdown' | 'field_goal' | 'punt' | 'turnover' | 'safety' | 'none'>('none')
  const [notes, setNotes] = useState('')
  const [primaryPlayerId, setPrimaryPlayerId] = useState<string | undefined>(undefined)
  const [overrideMode, setOverrideMode] = useState(false)
  const [manualDown, setManualDown] = useState(1)
  const [manualDistance, setManualDistance] = useState(10)
  const [manualFieldPosition, setManualFieldPosition] = useState<FieldPosition>({ yardLine: 20, side: 'home' })
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const voice = useVoiceInput()
  const saveButtonRef = useRef<HTMLButtonElement>(null)
  const [shouldFocusSaveButton, setShouldFocusSaveButton] = useState(false)

  // Calculate current game situation based on last play or default
  const currentSituation: GameSituation = useMemo(() => {
    if (!currentGame || currentGame.plays.length === 0) {
      return {
        down: 1,
        distance: 10,
        fieldPosition: currentGame?.currentFieldPosition || { yardLine: 20, side: 'home' }
      }
    }

    const lastPlay = currentGame.plays[0] // Most recent play
    
    // Calculate what the NEXT play situation should be based on the result of the last play
    const lastPlaySituation = {
      down: lastPlay.down,
      distance: lastPlay.distance,
      fieldPosition: lastPlay.fieldPosition
    }
    
    const nextPlayAfterLast = calculateNextPlay(lastPlaySituation, {
      yards: lastPlay.yards,
      result: lastPlay.result,
      playType: lastPlay.playType
    })
    
    return {
      down: nextPlayAfterLast.down,
      distance: nextPlayAfterLast.distance,
      fieldPosition: nextPlayAfterLast.fieldPosition
    }
  }, [currentGame])

  // Calculate suggested next play situation
  const nextSituation = useMemo(() => {
    // If no input yet, show current situation
    if (!yardsText || yardsText === '') {
      return { ...currentSituation, isNewSeries: false }
    }

    const yards = Number.isFinite(Number(yardsText)) ? Number(yardsText) : 0
    return calculateNextPlay(currentSituation, { yards, result, playType })
  }, [currentSituation, yardsText, result, playType])

  // Use manual overrides if in override mode, otherwise use calculated values
  const displaySituation = overrideMode ? {
    down: manualDown,
    distance: manualDistance,
    fieldPosition: manualFieldPosition
  } : nextSituation

  const canSave = Boolean(currentGame && formation.trim())

  // Focus save button when it becomes enabled after quick entry
  useEffect(() => {
    if (shouldFocusSaveButton && canSave && saveButtonRef.current) {
      console.log('Focusing Save button via useEffect')
      saveButtonRef.current.focus()
      // Visual indication that button is focused
      saveButtonRef.current.style.outline = '2px solid #3b82f6'
      setTimeout(() => {
        if (saveButtonRef.current) {
          saveButtonRef.current.style.outline = ''
        }
      }, 1000)
      setShouldFocusSaveButton(false)
    }
  }, [shouldFocusSaveButton, canSave])

  function onSave() {
    if (!currentGame || !currentGameId) return

    // Validate input data
    const errors = validatePlayData({
      formation,
      playType,
      yards: yardsText,
      result
    })

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    // Clear validation errors
    setValidationErrors([])

    // Sanitize input data
    const sanitized = sanitizePlayData({
      formation,
      playType,
      yards: yardsText,
      result,
      notes
    })

    const now = new Date().toISOString()
    const yardsNum = Number(sanitized.yards)
    
    // Use override values if in override mode, otherwise use current situation
    const playStartSituation = overrideMode ? {
      fieldPosition: manualFieldPosition,
      down: manualDown,
      distance: manualDistance
    } : currentSituation

    const play: Play = {
      id: crypto.randomUUID(),
      gameId: currentGameId,
      playNumber: nextPlayNumber(currentGame.plays),
      formation: sanitized.formation,
      playType: sanitized.playType,
      yards: yardsNum,
      result: sanitized.result as 'touchdown' | 'field_goal' | 'punt' | 'turnover' | 'safety' | 'none',
      fieldPosition: playStartSituation.fieldPosition, // This play's starting position
      down: playStartSituation.down, // This play's starting down
      distance: playStartSituation.distance, // This play's starting distance
      playerStats: [],
      primaryPlayerId: primaryPlayerId,
      timestamp: now,
      notes: sanitized.notes,
    }
    
    addPlay(currentGameId, play)
    
    // Reset form fields for next entry
    setFormation('')
    setYardsText('')
    setResult('none')
    setNotes('')
    setPrimaryPlayerId(undefined)
    setOverrideMode(false)
    
    // Update manual fields to calculated next situation for potential override
    setManualDown(nextSituation.down)
    setManualDistance(nextSituation.distance)
    setManualFieldPosition(nextSituation.fieldPosition)
  }

  if (!currentGame) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-primary">Play Entry</h1>
        <p className="mt-2 text-gray-700">No game loaded. Go to Game Setup to create or select a game.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-primary">Play Entry</h1>
      <p className="mt-1 text-gray-700">Current: {currentGame.homeTeam} vs {currentGame.awayTeam}</p>

      {/* Game Situation Display */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-blue-800">Current Situation</h3>
          <button 
            className="text-sm text-blue-600 underline"
            onClick={() => setOverrideMode(!overrideMode)}
          >
            {overrideMode ? 'Auto Calculate' : 'Manual Override'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-800">
              {formatDownDistance(currentSituation.down, currentSituation.distance)}
            </div>
            <div className="text-xs text-blue-600">Current Down</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-800">
              {formatFieldPosition(currentSituation.fieldPosition)}
            </div>
            <div className="text-xs text-blue-600">Field Position</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-700">
              {nextSituation.isNewSeries ? 'NEW SERIES' : `${formatDownDistance(displaySituation.down, displaySituation.distance)}`}
            </div>
            <div className="text-xs text-green-600">
              {nextSituation.isNewSeries ? nextSituation.seriesReason?.replace('_', ' ').toUpperCase() : 'Next Down'}
            </div>
            {overrideMode && (
              <div className="text-xs text-gray-500 mt-1">
                Override: {formatFieldPosition(manualFieldPosition)}
              </div>
            )}
          </div>
        </div>

        {/* Manual Override Controls */}
        {overrideMode && (
          <div className="mt-4 border-t border-blue-200 pt-4">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-blue-600">Down</label>
                <select 
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={manualDown}
                  onChange={(e) => setManualDown(Number(e.target.value))}
                >
                  <option value={1}>1st</option>
                  <option value={2}>2nd</option>
                  <option value={3}>3rd</option>
                  <option value={4}>4th</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-blue-600">Distance</label>
                <input 
                  type="number"
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={manualDistance}
                  onChange={(e) => setManualDistance(Number(e.target.value))}
                  min={1}
                  max={99}
                />
              </div>
              <div>
                <label className="text-xs text-blue-600">Yard Line</label>
                <input 
                  type="number"
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={manualFieldPosition.yardLine}
                  onChange={(e) => setManualFieldPosition({...manualFieldPosition, yardLine: Number(e.target.value)})}
                  min={1}
                  max={99}
                />
              </div>
              <div>
                <label className="text-xs text-blue-600">Side</label>
                <select 
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={manualFieldPosition.side}
                  onChange={(e) => setManualFieldPosition({...manualFieldPosition, side: e.target.value as 'home' | 'away'})}
                >
                  <option value="home">HOME</option>
                  <option value="away">AWAY</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid max-w-xl gap-4">
        {/* Voice input disabled - using quick entry instead */}
        {!voice.isSupported && (
          <div className="border rounded p-3 bg-yellow-50 text-sm text-yellow-700">
            Voice input not supported in this browser. Use manual entry below.
          </div>
        )}
        
        {/* Enhanced Quick Entry - Better than voice! */}
        <div className="border rounded p-3 bg-blue-50">
          <label className="text-sm font-medium text-blue-800">⚡ Quick Entry (Faster than voice!)</label>
          <div className="mt-2 flex gap-2">
            <input 
              className="flex-1 rounded border-2 border-blue-200 px-3 py-2 focus:border-blue-400 focus:outline-none" 
              placeholder="Type: '21 formation run 5 yards' or 'pass touchdown' then press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const text = e.currentTarget.value
                  if (text.trim()) {
                    console.log('🎯 Quick Entry Text:', text)
                    console.log('🎯 Available Players:', currentGame?.players?.map(p => p.name) || [])
                    
                    const parsed = parsePlayFromText(text, currentGame?.players)
                    console.log('🎯 Parsed Result:', parsed)
                    
                    if (parsed.formation) setFormation(parsed.formation)
                    if (parsed.playType) setPlayType(parsed.playType)
                    if (typeof parsed.yards === 'number') setYardsText(String(parsed.yards))
                    if (parsed.result) setResult(parsed.result)
                    if (parsed.playerId) {
                      console.log('🎯 Setting Primary Player ID:', parsed.playerId)
                      setPrimaryPlayerId(parsed.playerId)
                    }
                    setNotes((n) => (n ? n + ' ' : '') + (parsed.notes ?? ''))
                    e.currentTarget.value = ''
                    
                    // Visual feedback and set flag to focus save button
                    e.currentTarget.style.backgroundColor = '#dcfce7'
                    setTimeout(() => {
                      e.currentTarget.style.backgroundColor = ''
                    }, 200)
                    
                    // Flag to focus Save Play button when it becomes enabled
                    if (parsed.formation && currentGame) {
                      setShouldFocusSaveButton(true)
                    }
                  }
                }
              }}
            />
            <div className="text-xs text-blue-600 self-center font-medium">↵ Enter</div>
          </div>
                      <div className="text-xs text-blue-600 mt-1">
              ✨ Examples: "21 run gain of 3", "12 pass loss of 2", "11 pass touchdown", "22 run lost 1", "12 pass incomplete"
              <br />
              🎯 <strong>With Players:</strong> "21 Kamara run 5 yards", "12 Carr pass to Thomas touchdown", "11 Robinson rush loss of 2"
              <br />
              💡 <strong>Tip:</strong> Use last names only! "Kamara" works for "Alvin Kamara"
            </div>
        </div>
        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Formation</label>
          <div className="flex gap-2">
            <input className="flex-1 rounded border px-3 py-2" value={formation} onChange={(e) => setFormation(e.target.value)} placeholder="e.g., 21" />
            <button className="rounded border px-3 py-2" onClick={() => setFormationOpen(true)}>Select</button>
          </div>
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Play Type</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" checked={playType === 'run'} onChange={() => setPlayType('run')} />
              <span>Run</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={playType === 'pass'} onChange={() => setPlayType('pass')} />
              <span>Pass</span>
            </label>
          </div>
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Yards Gained/Lost</label>
          <input
            type="number"
            className="rounded border px-3 py-2"
            placeholder="e.g., -2 or 8"
            value={yardsText}
            onChange={(e) => setYardsText(e.target.value)}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Notes (optional)</label>
          <textarea
            className="rounded border px-3 py-2"
            placeholder="e.g., Kamara up the middle; deep left incomplete"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Result</label>
          <select className="rounded border px-3 py-2" value={result} onChange={(e) => setResult(e.target.value as typeof result)}>
            <option value="none">None</option>
            <option value="touchdown">Touchdown</option>
            <option value="field_goal">Field Goal</option>
            <option value="punt">Punt</option>
            <option value="turnover">Turnover</option>
            <option value="safety">Safety</option>
          </select>
        </div>

        {/* Player Selection */}
        {currentGame && (
          <PlayerSelector
            players={currentGame.players}
            selectedPlayerId={primaryPlayerId}
            onSelectPlayer={setPrimaryPlayerId}
            playType={playType}
            team={currentSituation.fieldPosition.side}
            label="Primary Player"
          />
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <h4 className="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="list-disc list-inside text-sm text-red-700">
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <button 
            ref={saveButtonRef}
            className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50" 
            disabled={!canSave} 
            onClick={onSave}
          >
            Save Play
          </button>
        </div>
      </div>

      {/* Formation History Section */}
      {currentGame && currentGame.plays.length > 0 && (
        <div className="mt-8 max-w-xl">
          <FormationHistory plays={currentGame.plays} />
        </div>
      )}

      {/* Player Statistics Section */}
      {currentGame && currentGame.players.length > 0 && (
        <div className="mt-8">
          <PlayerStatsList 
            players={currentGame.players} 
            plays={currentGame.plays} 
          />
        </div>
      )}

      <FormationModal
        isOpen={isFormationOpen}
        onClose={() => setFormationOpen(false)}
        onSelect={(f) => setFormation(f)}
      />
    </div>
  )
}

