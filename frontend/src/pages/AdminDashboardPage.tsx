import { useEffect, useState } from 'react';
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

interface CreateRaffleForm {
  title: string;
  description: string;
  prize: string;
  ticketPrice: string;
  totalTickets: string;
  drawDate: string;
}

const initialForm: CreateRaffleForm = {
  title: '',
  description: '',
  prize: '',
  ticketPrice: '',
  totalTickets: '',
  drawDate: '',
};

export default function AdminDashboardPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(initialForm);

  async function loadRaffles() {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<Raffle[]>('/raffles');
      setRaffles(response.data);
    } catch {
      setError('Failed to load raffles.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRaffles();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCreateRaffle(event: React.FormEvent) {
    event.preventDefault();

    try {
      setCreating(true);
      setError('');
      setSuccess('');

      await api.post('/raffles', {
        title: form.title,
        description: form.description,
        prize: form.prize,
        ticketPrice: Number(form.ticketPrice),
        totalTickets: Number(form.totalTickets),
        drawDate: new Date(form.drawDate).toISOString(),
      });

      setForm(initialForm);
      setShowForm(false);
      setSuccess('Raffle created successfully.');

      await loadRaffles();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to create raffle.',
      );
    } finally {
      setCreating(false);
    }
  }

  async function activateRaffle(id: string) {
    try {
      setError('');
      setSuccess('');

      await api.patch(`/raffles/${id}/activate`);

      setSuccess('Raffle activated successfully.');
      await loadRaffles();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to activate raffle.',
      );
    }
  }

  async function completeRaffle(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to complete this raffle?',
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await api.patch(`/raffles/${id}/complete`);

      setSuccess('Raffle completed successfully.');
      await loadRaffles();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to complete raffle.',
      );
    }
  }

  async function drawWinner(id: string) {
    const confirmed = window.confirm(
      'Draw the winner for this raffle now?',
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      const response = await api.post(
        `/winners/${id}/draw`,
      );

      setSuccess(
        `Winner drawn successfully: ${response.data.user.fullName}`,
      );

      await loadRaffles();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to draw winner.',
      );
    }
  }

  async function deleteRaffle(id: string) {
    const confirmed = window.confirm(
      'Delete this raffle permanently?',
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      await api.delete(`/raffles/${id}`);

      setSuccess('Raffle deleted successfully.');
      await loadRaffles();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to delete raffle.',
      );
    }
  }

  const activeRaffles = raffles.filter(
    (raffle) => raffle.status === 'ACTIVE',
  );

  const completedRaffles = raffles.filter(
    (raffle) => raffle.status === 'COMPLETED',
  );

  const totalTicketsSold = raffles.reduce(
    (total, raffle) => total + raffle.soldTickets,
    0,
  );

  const totalRevenue = raffles.reduce(
    (total, raffle) =>
      total + raffle.soldTickets * raffle.ticketPrice,
    0,
  );

  if (loading) {
    return (
      <main className="page-container">
        <div className="loading-state">
          Loading admin dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">
          Phoenix Administration
        </span>

        <h1>Admin Dashboard</h1>

        <p>
          Manage raffles, monitor ticket sales, and draw winners.
        </p>
      </section>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-success">
          {success}
        </div>
      )}

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Total Raffles</span>
          <strong>{raffles.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Active Raffles</span>
          <strong>{activeRaffles.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Completed</span>
          <strong>{completedRaffles.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Tickets Sold</span>
          <strong>{totalTicketsSold}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Gross Ticket Revenue</span>
          <strong>
            KSh {totalRevenue.toLocaleString()}
          </strong>
        </div>
      </section>

      <section className="admin-dashboard-actions">
        <button
          className="primary-button"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? 'Close Form' : '+ Create Raffle'}
        </button>
      </section>

      {showForm && (
        <section className="admin-form-card">
          <h2>Create New Raffle</h2>

          <form
            className="admin-form"
            onSubmit={handleCreateRaffle}
          >
            <label>
              Title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Prize
              <input
                name="prize"
                value={form.prize}
                onChange={handleChange}
                required
              />
            </label>

            <div className="admin-form-row">
              <label>
                Ticket Price (KSh)
                <input
                  type="number"
                  min="1"
                  name="ticketPrice"
                  value={form.ticketPrice}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Total Tickets
                <input
                  type="number"
                  min="1"
                  name="totalTickets"
                  value={form.totalTickets}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Draw Date
              <input
                type="datetime-local"
                name="drawDate"
                value={form.drawDate}
                onChange={handleChange}
                required
              />
            </label>

            <button
              className="primary-button"
              type="submit"
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Raffle'}
            </button>
          </form>
        </section>
      )}

      <section className="admin-raffles-section">
        <div className="section-heading">
          <span className="eyebrow">Management</span>
          <h2>All Raffles</h2>
        </div>

        {raffles.length === 0 ? (
          <div className="empty-state">
            No raffles found.
          </div>
        ) : (
          <div className="admin-raffle-list">
            {raffles.map((raffle) => {
              const progress =
                raffle.totalTickets > 0
                  ? (raffle.soldTickets /
                      raffle.totalTickets) *
                    100
                  : 0;

              return (
                <article
                  className="admin-raffle-card"
                  key={raffle.id}
                >
                  <div className="admin-raffle-header">
                    <div>
                      <span className="admin-label">
                        Raffle
                      </span>

                      <h2>{raffle.title}</h2>

                      <p>{raffle.prize}</p>
                    </div>

                    <span
                      className={`status-badge status-${raffle.status.toLowerCase()}`}
                    >
                      {raffle.status}
                    </span>
                  </div>

                  <div className="progress-wrapper">
                    <div className="progress-header">
                      <span>Tickets Sold</span>

                      <strong>
                        {raffle.soldTickets} /{' '}
                        {raffle.totalTickets}
                      </strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="admin-raffle-meta">
                    <span>
                      Ticket: KSh {raffle.ticketPrice}
                    </span>

                    <span>
                      Draw:{' '}
                      {new Date(
                        raffle.drawDate,
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="admin-raffle-actions">
                    {raffle.status === 'DRAFT' && (
                      <button
                        className="primary-button"
                        onClick={() =>
                          activateRaffle(raffle.id)
                        }
                      >
                        Activate
                      </button>
                    )}

                    {raffle.status === 'ACTIVE' && (
                      <button
                        className="primary-button"
                        onClick={() =>
                          drawWinner(raffle.id)
                        }
                      >
                        Draw Winner
                      </button>
                    )}

                    {raffle.status === 'ACTIVE' && (
                      <button
                        className="secondary-button"
                        onClick={() =>
                          completeRaffle(raffle.id)
                        }
                      >
                        Complete
                      </button>
                    )}

                    {raffle.status !== 'COMPLETED' && (
                      <button
                        className="admin-reject-button"
                        onClick={() =>
                          deleteRaffle(raffle.id)
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
