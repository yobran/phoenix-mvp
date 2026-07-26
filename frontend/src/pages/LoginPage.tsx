import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, saveToken } from '../api/auth';

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

      saveToken(result.accessToken);
      navigate('/');
    } catch {
      setError('Invalid phone number or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Link to="/">← Back to Phoenix</Link>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Phone number
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="0700000001"
            required
          />
        </label>

        <br />

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <br />

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}
