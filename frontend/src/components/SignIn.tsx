import { useState, type FormEvent } from 'react'
import { useAuth } from '../state/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignIn() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)

  const isValid = EMAIL_RE.test(email.trim())
  const showError = touched && !isValid && email.length > 0
  const showRequired = touched && email.length === 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!isValid) return
    signIn(email.trim())
  }

  return (
    <div className="signin-page">
      <div className="signin-orb" />
      <form className="signin-card" onSubmit={handleSubmit} noValidate>
        <h1 className="signin-title">Welcome to Bill</h1>
        <p className="signin-subtitle">Sign in with your email to find the cheapest way to pay for anything.</p>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`signin-input ${showError || showRequired ? 'has-error' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError || showRequired}
          aria-describedby="signin-error"
        />
        {showRequired && (
          <p className="signin-error" id="signin-error">
            Enter your email to continue.
          </p>
        )}
        {showError && (
          <p className="signin-error" id="signin-error">
            That doesn't look like a valid email address.
          </p>
        )}
        <button type="submit" className="signin-submit">
          Continue
        </button>
      </form>
    </div>
  )
}
