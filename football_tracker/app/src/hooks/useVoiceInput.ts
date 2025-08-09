import { useCallback, useEffect, useRef, useState } from 'react'

type SpeechRecognitionLike = typeof window extends any
  ? (Window & typeof globalThis & {
      webkitSpeechRecognition?: any
      SpeechRecognition?: any
    })['SpeechRecognition']
  : any

interface UseVoiceInputState {
  isSupported: boolean
  listening: boolean
  transcript: string
  error: string | null
  start: () => void
  stop: () => void
  reset: () => void
}

export function useVoiceInput(): UseVoiceInputState {
  const RecognitionCtor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  const recognitionRef = useRef<any | null>(null)
  const [isSupported] = useState<boolean>(Boolean(RecognitionCtor))
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupported) return
    const recognition: any = new RecognitionCtor() as SpeechRecognitionLike
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setListening(true)
      setError(null)
      setTranscript('')
    }
    recognition.onerror = (e: any) => {
      console.error('Voice recognition error:', e)
      let errorMessage = 'voice_error'
      
      switch (e?.error) {
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.'
          break
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.'
          break
        case 'network':
          errorMessage = 'Voice recognition requires HTTPS. Try accessing via https://localhost:5174 or use manual entry.'
          break
        case 'service-not-allowed':
          errorMessage = 'Voice service not allowed. Try using HTTPS.'
          break
        case 'bad-grammar':
          errorMessage = 'Speech recognition grammar error.'
          break
        default:
          errorMessage = `Voice error: ${e?.error || 'unknown'}`
      }
      
      setError(errorMessage)
      setListening(false)
    }
    recognition.onend = () => {
      setListening(false)
    }
    recognition.onresult = (event: any) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i]
        const text = result[0]?.transcript || ''
        if (result.isFinal) finalText += text
        setTranscript((prev) => (prev ? prev + ' ' + text : text))
      }
      if (finalText) setTranscript((prev) => prev || finalText)
    }

    recognitionRef.current = recognition
    return () => {
      try {
        recognition.stop()
      } catch {}
      recognitionRef.current = null
    }
  }, [isSupported, RecognitionCtor])

  const start = useCallback(async () => {
    if (!recognitionRef.current) return
    
    // Clear any previous errors
    setError(null)
    
    // Check for microphone permissions if available
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
        if (permission.state === 'denied') {
          setError('Microphone permission denied. Please allow microphone access in your browser settings.')
          return
        }
      } catch (e) {
        console.log('Permission check not available:', e)
      }
    }
    
    try {
      recognitionRef.current.start()
    } catch (e) {
      console.error('Failed to start voice recognition:', e)
      setError('Failed to start voice recognition. Please try again.')
    }
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {}
  }, [])

  const reset = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return { isSupported, listening, transcript, error, start, stop, reset }
}

