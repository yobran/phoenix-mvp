import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, saveAuth } from '../api/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result = await login({
        phone,
        password,
      });

      saveAuth(result);

      if (result.user.role === 'ADMIN') {
        navigate('/admin/payments');
      } else {
        navigate('/');
      }
    } catch {
      setError('Invalid phone number or password');
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
        <span className="eyebrow">Welcome back</span>

        <h1>Login</h1>

        <p className="auth-description">
          Access your Phoenix account and manage your raffle
          entries.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
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
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
