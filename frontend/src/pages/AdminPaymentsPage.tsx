import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface User {
  fullName: string;
  phone: string;
}

interface Ticket {
  ticketNumber: string;
  status: string;
}

interface Raffle {
  title: string;
  prize: string;
}

interface Payment {
  id: string;
  amount: number;
  transactionCode: string | null;
  paymentMessage: string | null;
  status: string;
  createdAt: string;
  user: User;
  ticket: Ticket;
  raffle: Raffle;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState('');

  async function loadPayments() {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<Payment[]>(
        '/payments/pending/all',
      );

      setPayments(response.data);
    } catch {
      setError(
        'Failed to load pending payments. Make sure you are logged in as an admin.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  async function handleVerification(
    paymentId: string,
    status: 'VERIFIED' | 'REJECTED',
  ) {
    const action =
      status === 'VERIFIED'
        ? 'verify this payment'
        : 'reject this payment';

    const confirmed = window.confirm(
      `Are you sure you want to ${action}?`,
    );

    if (!confirmed) return;

    try {
      setProcessingId(paymentId);
      setError('');

      await api.post(`/payments/${paymentId}/verify`, {
        status,
      });

      setPayments((currentPayments) =>
        currentPayments.filter(
          (payment) => payment.id !== paymentId,
        ),
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to process payment.',
      );
    } finally {
      setProcessingId('');
    }
  }

  function getPhoneNumber(phone: string) {
    return phone.replace(/\s+/g, '');
  }

  function getWhatsAppLink(phone: string) {
    let cleanedPhone = getPhoneNumber(phone);

    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = `254${cleanedPhone.substring(1)}`;
    }

    if (cleanedPhone.startsWith('+')) {
      cleanedPhone = cleanedPhone.substring(1);
    }

    return `https://wa.me/${cleanedPhone}`;
  }

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">
          Loading pending payments...
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">
          Administration
        </span>

        <h1>Payment Verification</h1>

        <p>
          Review payment proof and manually verify legitimate
          payments.
        </p>
      </section>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {payments.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">✅</div>

          <h2>No pending payments</h2>

          <p>
            All submitted payments have been processed.
          </p>
        </section>
      ) : (
        <section className="admin-payment-list">
          {payments.map((payment) => (
            <article
              className="admin-payment-card"
              key={payment.id}
            >
              <div className="admin-payment-header">
                <div>
                  <span className="ticket-label">
                    Payment proof
                  </span>

                  <h2>
                    {payment.transactionCode ||
                      'Full message submitted'}
                  </h2>
                </div>

                <span className="payment-status payment-pending">
                  PENDING
                </span>
              </div>

              <div className="admin-payment-body">
                <div className="admin-payment-grid">
                  <div>
                    <span className="admin-label">
                      Customer
                    </span>

                    <strong>
                      {payment.user.fullName}
                    </strong>

                    <span>
                      {payment.user.phone}
                    </span>
                  </div>

                  <div>
                    <span className="admin-label">
                      Raffle
                    </span>

                    <strong>
                      {payment.raffle.title}
                    </strong>

                    <span>
                      {payment.raffle.prize}
                    </span>
                  </div>

                  <div>
                    <span className="admin-label">
                      Ticket
                    </span>

                    <strong>
                      {payment.ticket.ticketNumber}
                    </strong>

                    <span>
                      Status: {payment.ticket.status}
                    </span>
                  </div>

                  <div>
                    <span className="admin-label">
                      Amount
                    </span>

                    <strong>
                      KSh {payment.amount}
                    </strong>

                    <span>
                      Submitted{' '}
                      {new Date(
                        payment.createdAt,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="payment-proof-box">
                  <span className="admin-label">
                    Submitted M-Pesa Message / Payment Proof
                  </span>

                  <p>
                    {payment.paymentMessage ||
                      payment.transactionCode ||
                      'No payment proof submitted'}
                  </p>
                </div>

                <div className="admin-contact-actions">
                  <a
                    className="secondary-button"
                    href={`tel:${getPhoneNumber(
                      payment.user.phone,
                    )}`}
                  >
                    📞 Call Customer
                  </a>

                  <a
                    className="secondary-button"
                    href={getWhatsAppLink(
                      payment.user.phone,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    💬 WhatsApp Customer
                  </a>
                </div>

                <div className="admin-payment-actions">
                  <button
                    className="admin-reject-button"
                    disabled={
                      processingId === payment.id
                    }
                    onClick={() =>
                      handleVerification(
                        payment.id,
                        'REJECTED',
                      )
                    }
                  >
                    {processingId === payment.id
                      ? 'Processing...'
                      : 'Reject Payment'}
                  </button>

                  <button
                    className="admin-verify-button"
                    disabled={
                      processingId === payment.id
                    }
                    onClick={() =>
                      handleVerification(
                        payment.id,
                        'VERIFIED',
                      )
                    }
                  >
                    {processingId === payment.id
                      ? 'Processing...'
                      : 'Verify Payment'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
