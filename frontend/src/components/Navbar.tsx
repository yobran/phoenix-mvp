import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../api/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getToken());

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

        {isLoggedIn ? (
          <>
            <Link className="nav-link" to="/my-tickets">
              My Tickets
            </Link>

            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link className="nav-link" to="/login">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
