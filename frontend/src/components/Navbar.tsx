import { Link, useNavigate } from 'react-router-dom';
import {
  getToken,
  getUser,
  logout,
} from '../api/auth';

export default function Navbar() {
  const navigate = useNavigate();

  const token = getToken();
  const user = getUser();

  const isLoggedIn = Boolean(token);
  const isAdmin = user?.role === 'ADMIN';

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        Phoenix
      </Link>

      <nav className="nav-links">
        <Link className="nav-link" to="/">
          Raffles
        </Link>
        <Link className="nav-link" to="/winners">
  Winners
</Link>

        {isLoggedIn && !isAdmin && (
          <Link
            className="nav-link"
            to="/my-tickets"
          >
            My Tickets
          </Link>
        )}
{isAdmin && (
  <>
    <Link
      className="nav-link"
      to="/admin/dashboard"
    >
      Dashboard
    </Link>

    <Link
      className="nav-link"
      to="/admin/payments"
    >
      Admin Payments
    </Link>
  </>
)}

        {isLoggedIn ? (
          <button
            className="nav-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link
            className="nav-link"
            to="/login"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
