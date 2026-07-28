import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RaffleDetailsPage from './pages/RaffleDetailsPage';
import LoginPage from './pages/LoginPage';
import PaymentPage from './pages/PaymentPage';
import MyTicketsPage from './pages/MyTicketsPage';
import RegisterPage from './pages/RegisterPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import WinnersPage from './pages/WinnersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/raffles/:id" element={<RaffleDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/payments/:id" element={<PaymentPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/winners" element={<WinnersPage />} />
          <Route
  path="/admin/dashboard"
  element={<AdminDashboardPage />}
/>

          {/* Admin */}
          <Route
            path="/admin/payments"
            element={<AdminPaymentsPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;