import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { getToken } from '../api/auth';

interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  drawDate: string;
  status: string;
}

interface PurchaseResponse {
  message: string;
  ticket: {
    id: string;
    ticketNumber: string;
    status: string;
  };
  payment: {
    id: string;
    amount: number;
    status: string;
    transactionCode: string | null;
  };
}

export default function RaffleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');
  const [purchase, setPurchase] = useState<PurchaseResponse | null>(null);

  useEffect(() => {
    if (!id) return;

    api
      .get<Raffle>(`/raffles/${id}`)
      .then((response) => {
        setRaffle(response.data);
      })
      .catch(() => {
        setError('Failed to load raffle');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  async function handleBuyTicket() {
    const token = getToken();

    if (!token) {
      navigate('/login');
      return;
    }

    if (!id) return;

    setBuying(true);
    setError('');

    try {
      const response = await api.post<PurchaseResponse>('/tickets/buy', {
        raffleId: id,
      });

      setPurchase(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to purchase ticket',
      );
    } finally {
      setBuying(false);
    }
  }

  if (loading) {
    return <p className="loading-state">Loading raffle...</p>;
  }

  if (error && !purchase) {
    return <p className="error-state">{error}</p>;
  }

  if (!raffle) {
    return <p className="error-state">Raffle not found</p>;
  }

  if (purchase) {
    return (
      <main className="page-container">
        <div className="raffle-details">
          <span className="eyebrow">Ticket Reserved</span>

          <h1>🎉 Your ticket is reserved!</h1>

          <p className="raffle-description">
            Complete your payment and submit your M-Pesa transaction code
            to finalize your ticket.
          </p>

          <div className="purchase-panel">
            <div>
              <h3>🎟 Ticket Number</h3>
              <p>{purchase.ticket.ticketNumber}</p>
            </div>

            <div>
              <h3>💰 Amount</h3>
              <p>KSh {purchase.payment.amount}</p>
            </div>
          </div>

          <div className="info-panel" style={{ marginTop: '24px' }}>
            <h3>Payment Instructions</h3>

            <p>
              Send <strong>KSh {purchase.payment.amount}</strong> via M-Pesa
              using the payment details provided by Phoenix.
            </p>

            <p>
              After payment, submit your transaction code to complete
              verification.
            </p>

            <Link
              to={`/payments/${purchase.payment.id}`}
              className="primary-button"
            >
              Submit Transaction Code
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const percentageSold =
    raffle.totalTickets > 0
      ? (raffle.soldTickets / raffle.totalTickets) * 100
      : 0;

  return (
    <main className="page-container">
      <Link to="/" className="back-link">
        ← Back to raffles
      </Link>

      <div className="raffle-details">
        <div className="raffle-details-header">
          <div>
            <span className="eyebrow">Live Giveaway</span>

            <h1>{raffle.title}</h1>

            <p className="raffle-description">
              {raffle.description}
            </p>
          </div>

          <span className="status-badge status-active">
            {raffle.status}
          </span>
        </div>

        <div className="raffle-details-grid">
          <div className="prize-panel">
            <div className="prize-icon">🎁</div>

            <span className="panel-label">Grand Prize</span>

            <h2>{raffle.prize}</h2>

            <p>One lucky participant will win this amazing prize.</p>
          </div>

          <div className="info-panel">
            <div className="info-row">
              <span>Ticket Price</span>
              <strong>KSh {raffle.ticketPrice}</strong>
            </div>

            <div className="info-row">
              <span>Draw Date</span>
              <strong>
                {new Date(raffle.drawDate).toLocaleDateString()}
              </strong>
            </div>

            <div className="progress-wrapper">
              <div className="progress-header">
                <span>Tickets Sold</span>
                <strong>
                  {raffle.soldTickets} / {raffle.totalTickets}
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${percentageSold}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="error-state">{error}</p>}

        <div className="purchase-panel">
          <div>
            <h3>Ready to participate?</h3>
            <p>Reserve your ticket now for KSh {raffle.ticketPrice}.</p>
          </div>

          <button
            className="primary-button"
            onClick={handleBuyTicket}
            disabled={buying}
          >
            {buying ? 'Reserving Ticket...' : 'Buy Ticket'}
          </button>
        </div>
      </div>
    </main>
  );
}
