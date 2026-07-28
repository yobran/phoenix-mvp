import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await register({
        fullName,
        phone,
        email: email || undefined,
        password,
      });

      navigate('/login');
    } catch {
      setError(
        'Registration failed. The phone number or email may already be registered.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container auth-page">
      <Link className="back-link" to="/">
        ← Back to Phoenix
      </Link>

      <section className="auth-card">
        <span className="eyebrow">Join Phoenix</span>

        <h1>Create account</h1>

        <p className="auth-description">
          Create your account and start entering Phoenix raffles.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Full name

            <input
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="John Doe"
              required
            />
          </label>

          <label>
            Phone number

            <input
              type="text"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="0700000001"
              required
            />
          </label>

          <label>
            Email address

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={6}
            />
          </label>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
