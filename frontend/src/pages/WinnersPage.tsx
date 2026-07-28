import { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Winner {
  id: string;
  createdAt: string;
  raffle: {
    title: string;
    prize: string;
    drawDate: string;
  };
  ticket: {
    ticketNumber: string;
  };
  user: {
    fullName: string;
    phone: string;
  };
}

function maskPhone(phone: string) {
  if (phone.length < 6) {
    return phone;
  }

  return `${phone.slice(0, 3)}****${phone.slice(-2)}`;
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Winner[]>('/winners')
      .then((response) => {
        setWinners(response.data);
      })
      .catch(() => {
        setError('Failed to load winners');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">
          <p>Loading winners...</p>
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

  return (
    <main className="page-container">
      <section className="hero-section">
        <span className="eyebrow">Celebrating the winners</span>

        <h1>
          Someone had to win.
          <br />
          It could be you next.
        </h1>

        <p>
          Explore previous Phoenix raffle winners and see the
          tickets that made their big moments possible.
        </p>
      </section>

      <section>
        <div className="section-heading">
          <span className="eyebrow">Past winners</span>
          <h2>Winner's Circle</h2>
        </div>

        {winners.length === 0 ? (
          <div className="loading-state">
            <p>No winners have been announced yet.</p>
          </div>
        ) : (
          <div className="winner-grid">
            {winners.map((winner) => (
              <article
                className="winner-card"
                key={winner.id}
              >
                <div className="winner-icon">
                  🏆
                </div>

                <span className="eyebrow">
                  Winner
                </span>

                <h3>
                  {winner.user.fullName}
                </h3>

                <p className="winner-phone">
                  {maskPhone(winner.user.phone)}
                </p>

                <div className="winner-details">
                  <div>
                    <span className="admin-label">
                      Raffle
                    </span>

                    <strong>
                      {winner.raffle.title}
                    </strong>
                  </div>

                  <div>
                    <span className="admin-label">
                      Prize
                    </span>

                    <strong>
                      {winner.raffle.prize}
                    </strong>
                  </div>

                  <div>
                    <span className="admin-label">
                      Winning ticket
                    </span>

                    <strong className="winning-ticket">
                      {winner.ticket.ticketNumber}
                    </strong>
                  </div>

                  <div>
                    <span className="admin-label">
                      Drawn
                    </span>

                    <strong>
                      {new Date(
                        winner.createdAt,
                      ).toLocaleDateString()}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
