import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();

  const [transactionCode, setTransactionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const code = transactionCode.trim();

    if (!id || !code) {
      setError('Please enter your M-Pesa transaction code');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await api.post(`/payments/${id}/submit-code`, {
        transactionCode: code,
      });

      setSubmittedCode(code);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit transaction code');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="page-container auth-page">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        <section className="auth-card">
          <h1>🎉 Transaction Code Submitted</h1>

          <p>
            Your transaction code has been submitted successfully and is now
            awaiting verification.
          </p>

          <section>
            <h2>Payment Status</h2>

            <p>
              <strong>Transaction Code:</strong> {submittedCode}
            </p>

            <p>
              <strong>Status:</strong> ⏳ Awaiting verification
            </p>
          </section>

          <p>
            Your ticket will be confirmed once an administrator verifies your
            payment.
          </p>

          <Link to="/">
            <button className="primary-button">
              ← Back to Home
            </button>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container auth-page">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <section className="auth-card">
        <h1>Submit Transaction Code</h1>

        <p className="auth-description">
          Enter the M-Pesa transaction code you received after making your
          payment.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="transactionCode">
            M-Pesa Transaction Code
            <input
              id="transactionCode"
              type="text"
              value={transactionCode}
              onChange={(event) => setTransactionCode(event.target.value)}
              placeholder="e.g. TST-FRONTEND-001"
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Transaction Code'}
          </button>
        </form>
      </section>
    </main>
  );
}
