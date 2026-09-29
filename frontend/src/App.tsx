import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/categories" element={<div>Категории</div>} />
        <Route path="/budgets" element={<div>Бюджеты</div>} />
        <Route path="/reports" element={<div>Отчёты</div>} />
      </Route>
    </Routes>
  );
}

export default App;