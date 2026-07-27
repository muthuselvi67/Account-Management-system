import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Students from './pages/Students';
import Payments from './pages/Payments';
import Projects from './pages/Projects';
import Expenses from './pages/Expenses';
import Salaries from './pages/Salaries';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Calendar from './pages/Calendar';
import ClaimsPlaceholder from './pages/ClaimsPlaceholder';
import OperationalExpenses from './pages/OperationalExpenses';
import RunningCosts from './pages/RunningCosts';
import EmployeeRunningCosts from './pages/EmployeeRunningCosts';
import OperationalRunningCosts from './pages/OperationalRunningCosts';
import GST from './pages/GST';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceHistory from './pages/InvoiceHistory';
import CompanyProfile from './pages/CompanyProfile';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userRole');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes inside Layout */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="payments" element={<Payments />} />
          <Route path="projects" element={<Projects />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="salaries" element={<Salaries />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="calendar" element={<Calendar />} />

          {/* Claims Route */}
          <Route path="claims" element={<ClaimsPlaceholder />} />
          <Route path="operational-expenses" element={<OperationalExpenses />} />
          <Route path="running-costs" element={<RunningCosts />} />
          <Route path="employee-running-costs" element={<EmployeeRunningCosts />} />
          <Route path="operational-running-costs" element={<OperationalRunningCosts />} />
          <Route path="gst" element={<GST />} />
          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="invoice-history" element={<InvoiceHistory />} />
          <Route path="company-profile" element={<CompanyProfile />} />

        </Route>
        
        {/* Catch-all route to redirect unknown URLs to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
