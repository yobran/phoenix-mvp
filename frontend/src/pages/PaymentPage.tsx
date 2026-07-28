import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();

  const [paymentMessage, setPaymentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const message = paymentMessage.trim();

    if (!id || !message) {
      setError('Please paste your M-Pesa confirmation message or transaction code.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await api.post(`/payments/${id}/submit-code`, {
        transactionCode: message,
      });

      setSubmittedMessage(message);
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to submit payment details.',
      );
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
          <h1>🎉 Payment Submitted</h1>

          <p>
            Your payment details have been submitted successfully
            and are awaiting manual verification.
          </p>

          <section>
            <h2>Payment Status</h2>

            <p>
              <strong>Status:</strong> ⏳ Awaiting verification
            </p>

            <div className="payment-message-preview">
              <strong>Submitted payment details:</strong>

              <p>
                {submittedMessage}
              </p>
            </div>
          </section>

          <p>
            Your ticket will be confirmed once an administrator
            verifies your payment.
          </p>

          <Link to="/my-tickets">
            <button className="primary-button">
              View My Ticket
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
        <h1>Submit Payment Details</h1>

        <p className="auth-description">
          After making your M-Pesa payment, paste the full
          confirmation message below. You may also enter only
          the transaction code.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="paymentMessage">
            M-Pesa Confirmation Message or Transaction Code

            <textarea
              id="paymentMessage"
              value={paymentMessage}
              onChange={(event) =>
                setPaymentMessage(event.target.value)
              }
              placeholder={
                'Example:\n\nTK12345678 Confirmed. Ksh1,000.00 sent to Phoenix...'
              }
              rows={7}
              required
            />
          </label>

          <p className="form-help-text">
            Paste the entire M-Pesa message if you have it.
            This helps our admin verify your payment manually.
          </p>

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
              ? 'Submitting...'
              : 'Submit Payment Details'}
          </button>
        </form>
      </section>
    </main>
  );
}
