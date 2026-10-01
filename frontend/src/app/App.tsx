import { Routes, Route } from 'react-router-dom';
import { FinanceProvider } from '../entities/finance';
import { AuthProvider } from '../entities/user';
import AuthPage from '../pages/AuthPage';
import BudgetsPage from '../pages/BudgetsPage';
import CategoriesPage from '../pages/CategoriesPage';
import DashboardPage from '../pages/DashboardPage';
import ReportsPage from '../pages/ReportsPage';
import TransactionsPage from '../pages/TransactionsPage';
import NotifyProvider from '../shared/ui/NotifyProvider';
import AppLayout from './layout/AppLayout';
import { GuestOnly, RequireAuth } from './RouteGuards';

function App() {
  return (
    <NotifyProvider>
      <AuthProvider>
          <Routes>
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route
                element={
                  <FinanceProvider>
                    <AppLayout />
                  </FinanceProvider>
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/budgets" element={<BudgetsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
            </Route>
          </Routes>
      </AuthProvider>
    </NotifyProvider>
  );
}

export default App;
