import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

interface Raffle {
  title: string;
  prize: string;
  ticketPrice: number;
  drawDate: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  transactionCode: string | null;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  status: string;
  raffle: Raffle;
  payment: Payment;
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Ticket[]>('/tickets/my')
      .then((response) => {
        setTickets(response.data);
      })
      .catch(() => {
        setError('Failed to load your tickets');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">Loading your tickets...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="error-state">{error}</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">Your entries</span>

        <h1>My Tickets</h1>

        <p>
          Track your raffle entries, payment status, and ticket numbers.
        </p>
      </section>

      {tickets.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">🎟️</div>

          <h2>No tickets yet</h2>

          <p>
            You haven't entered any raffles yet. Your next big win could be
            one ticket away.
          </p>

          <Link className="primary-button" to="/">
            Browse raffles
          </Link>
        </section>
      ) : (
        <section className="ticket-grid">
          {tickets.map((ticket) => (
            <article className="ticket-card" key={ticket.id}>
              <div className="ticket-card-header">
                <div>
                  <span className="ticket-label">Ticket number</span>

                  <h2>{ticket.ticketNumber}</h2>
                </div>

                <span
                  className={`ticket-status ticket-status-${ticket.status.toLowerCase()}`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="ticket-card-body">
                <h3>{ticket.raffle.title}</h3>

                <p className="ticket-prize">
                  🏆 {ticket.raffle.prize}
                </p>

                <div className="ticket-info-row">
                  <span>Payment</span>

                  <strong
                    className={`payment-status payment-${ticket.payment.status.toLowerCase()}`}
                  >
                    {ticket.payment.status}
                  </strong>
                </div>

                <div className="ticket-info-row">
                  <span>Amount</span>

                  <strong>KSh {ticket.payment.amount}</strong>
                </div>

                <div className="ticket-info-row">
                  <span>Draw date</span>

                  <strong>
                    {new Date(ticket.raffle.drawDate).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              {ticket.payment.status === 'PENDING' && (
                <div className="ticket-action">
                  <Link
                    className="primary-button"
                    to={`/payments/${ticket.payment.id}`}
                  >
                    Submit payment code
                  </Link>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
