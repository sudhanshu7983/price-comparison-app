import { useState, type FormEvent } from 'react'
import { useAuth } from '../state/AuthContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignIn() {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = EMAIL_RE.test(email.trim())
  const passwordIsValid = password.length >= 8
  const passwordsMatch = password === confirmPassword
  const isFormValid = isValid && passwordIsValid && (!isSignUp || (passwordsMatch && confirmPassword.length > 0))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    setError(null)
    if (!isFormValid) return

    setIsSubmitting(true)
    try {
      if (isSignUp) await signUp(email, password)
      else await signIn(email, password)
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to authenticate')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-orb" />
      <form className="signin-card" onSubmit={handleSubmit} noValidate>
        <h1 className="signin-title">{isSignUp ? 'Create your Bill account' : 'Welcome to Bill'}</h1>
        <p className="signin-subtitle">
          {isSignUp ? 'Save comparisons and find the cheapest way to pay for anything.' : 'Sign in to find the cheapest way to pay for anything.'}
        </p>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`signin-input ${touched && !isValid ? 'has-error' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={touched && !isValid}
        />
        {touched && !isValid && (
          <p className="signin-error" id="signin-error">
            That doesn't look like a valid email address.
          </p>
        )}
        <input
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          placeholder="Password (8+ characters)"
          className={`signin-input ${touched && !passwordIsValid ? 'has-error' : ''}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        {isSignUp && (
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            className={`signin-input ${touched && !passwordsMatch ? 'has-error' : ''}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-label="Confirm password"
          />
        )}
        {touched && !passwordIsValid && <p className="signin-error">Password must be at least 8 characters.</p>}
        {touched && isSignUp && confirmPassword.length > 0 && !passwordsMatch && (
          <p className="signin-error">Passwords do not match.</p>
        )}
        {error && <p className="signin-error">{error}</p>}
        <button type="submit" className="signin-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
        <button type="button" className="signin-switch" onClick={() => { setIsSignUp(!isSignUp); setError(null); setTouched(false) }}>
          {isSignUp ? 'Already have an account? Sign in' : 'New to Bill? Create an account'}
        </button>
      </form>
    </div>
  )
}
