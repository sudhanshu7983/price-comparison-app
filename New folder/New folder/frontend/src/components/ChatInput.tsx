import { useEffect, useRef, useState } from 'react'
import { IconMic, IconSend } from './Icons'

interface ChatInputProps {
  onSubmit: (query: string) => void
  disabled?: boolean
  placeholder?: string
}

interface SpeechRecognitionResultLike {
  results: { [index: number]: { [index: number]: { transcript: string } } }
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionResultLike) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function ChatInput({ onSubmit, disabled, placeholder = 'Ask a followup question' }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const speechSupported = typeof window !== 'undefined' && getSpeechRecognition() !== null

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed) {
      setError('Type or say what you want to save on first.')
      return
    }
    if (trimmed.length < 2) {
      setError(' try a few more words.')
      return
    }
    setError(null)
    onSubmit(trimmed)
    setValue('')
  }

  function toggleMic() {
    const Recognition = getSpeechRecognition()
    if (!Recognition) {
      setError('Voice input is not supported in this browser.')
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const recognition = new Recognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript
      if (transcript) {
        setValue((prev) => (prev ? `${prev} ${transcript}` : transcript))
        setError(null)
      }
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return (
    <div>
      {error && <p className="chat-input-error">{error}</p>}
      <div className="chat-input-bar">
        <div className="chat-input-shell">
          <input
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            aria-label="Search query"
          />
          {speechSupported && (
            <button
              type="button"
              className={`mic-button ${isListening ? 'is-listening' : ''}`}
              onClick={toggleMic}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            >
              <IconMic size={17} />
            </button>
          )}
          <button type="button" onClick={handleSubmit} disabled={disabled} aria-label="Send">
            <IconSend />
          </button>
        </div>
      </div>
    </div>
  )
}
