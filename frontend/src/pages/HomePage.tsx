import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

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

export default function HomePage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Raffle[]>('/raffles')
      .then((response) => {
        setRaffles(response.data);
      })
      .catch(() => {
        setError('Failed to load raffles');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">
          <p>Loading active raffles...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="error-state">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  const activeRaffles = raffles.filter(
    (raffle) => raffle.status === 'ACTIVE',
  );

  return (
    <main className="page-container">
      <section className="hero-section">
        <span className="eyebrow">Win something extraordinary</span>

        <h1>
          Your next big win
          <br />
          could be one ticket away.
        </h1>

        <p>
          Enter exciting raffles, discover incredible prizes, and get your
          chance to win with Phoenix.
        </p>
      </section>

      <section>
        <div className="section-heading">
          <span className="eyebrow">Live now</span>
          <h2>Active Raffles</h2>
        </div>

        {activeRaffles.length === 0 ? (
          <div className="loading-state">
            <p>There are no active raffles at the moment.</p>
          </div>
        ) : (
          <div className="raffle-grid">
            {activeRaffles.map((raffle) => {
              const progress =
                raffle.totalTickets > 0
                  ? (raffle.soldTickets / raffle.totalTickets) * 100
                  : 0;

              return (
                <article className="raffle-card" key={raffle.id}>
                  <span className="status-badge status-active">ACTIVE</span>

                  <h3>{raffle.title}</h3>

                  <p>{raffle.description}</p>

                  <p>
                    <strong>Prize:</strong> {raffle.prize}
                  </p>

                  <p>
                    <strong>Ticket:</strong> KSh {raffle.ticketPrice}
                  </p>

                  <div className="progress-wrapper">
                    <div className="progress-header">
                      <span>Tickets sold</span>
                      <span>
                        {raffle.soldTickets} / {raffle.totalTickets}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <br />

                  <Link
                    className="secondary-button"
                    to={`/raffles/${raffle.id}`}
                  >
                    View Raffle
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}