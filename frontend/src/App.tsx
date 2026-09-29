import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<div>Обзор</div>} />
        <Route path="/transactions" element={<div>Транзакции</div>} />
        <Route path="/categories" element={<div>Категории</div>} />
        <Route path="/budgets" element={<div>Бюджеты</div>} />
        <Route path="/reports" element={<div>Отчёты</div>} />
      </Route>
    </Routes>
  );
}

export default App;