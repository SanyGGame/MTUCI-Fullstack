import { Routes, Route } from 'react-router-dom';
import { FinanceProvider } from '../entities/finance';
import BudgetsPage from '../pages/BudgetsPage';
import CategoriesPage from '../pages/CategoriesPage';
import DashboardPage from '../pages/DashboardPage';
import ReportsPage from '../pages/ReportsPage';
import TransactionsPage from '../pages/TransactionsPage';
import NotifyProvider from '../shared/ui/NotifyProvider';
import AppLayout from './layout/AppLayout';

function App() {
  return (
    <NotifyProvider>
      <FinanceProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </FinanceProvider>
    </NotifyProvider>
  );
}

export default App;
