import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Payments from './pages/Payments';
import Projects from './pages/Projects';
import Expenses from './pages/Expenses';
import Salaries from './pages/Salaries';
import ClientData from './pages/ClientData';
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

import ClientsHub from './pages/ClientsHub';
import CompaniesHub from './pages/CompaniesHub';

// Clients (Inwards)
import ClientCommunications from './pages/ClientCommunications';
import ClientEnquiries from './pages/ClientEnquiries';
import ClientQuotations from './pages/ClientQuotations';
import ClientPOs from './pages/ClientPOs';
import ClientDeliveries from './pages/ClientDeliveries';
import ClientInvoices from './pages/ClientInvoices';
import ClientPayments from './pages/ClientPayments';
import OutputGST from './pages/OutputGST';
import ClientTDS from './pages/ClientTDS';

// Vendors (Outwards)
import VendorCommunications from './pages/VendorCommunications';
import VendorEnquiries from './pages/VendorEnquiries';
import VendorQuotations from './pages/VendorQuotations';
import VendorPOs from './pages/VendorPOs';
import VendorDeliveries from './pages/VendorDeliveries';
import VendorInvoices from './pages/VendorInvoices';
import VendorPayments from './pages/VendorPayments';
import InputGST from './pages/InputGST';
import VendorTDS from './pages/VendorTDS';

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
          <Route path="employees" element={<Employees />} />
          <Route path="payments" element={<Payments />} />
          <Route path="projects" element={<Projects />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="salaries" element={<Salaries />} />
          <Route path="client-data" element={<ClientData />} />
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

          <Route path="clients-hub" element={<ClientsHub />} />
          <Route path="companies-hub" element={<CompaniesHub />} />

          {/* Client (Inwards) Routes */}
          <Route path="client-communications" element={<ClientCommunications />} />
          <Route path="client-enquiries" element={<ClientEnquiries />} />
          <Route path="client-quotations" element={<ClientQuotations />} />
          <Route path="client-pos" element={<ClientPOs />} />
          <Route path="client-deliveries" element={<ClientDeliveries />} />
          <Route path="client-invoices" element={<ClientInvoices />} />
          <Route path="client-payments" element={<ClientPayments />} />
          <Route path="output-gst" element={<OutputGST />} />
          <Route path="client-tds" element={<ClientTDS />} />

          {/* Vendor (Outwards) Routes */}
          <Route path="vendor-communications" element={<VendorCommunications />} />
          <Route path="vendor-enquiries" element={<VendorEnquiries />} />
          <Route path="vendor-quotations" element={<VendorQuotations />} />
          <Route path="vendor-pos" element={<VendorPOs />} />
          <Route path="vendor-deliveries" element={<VendorDeliveries />} />
          <Route path="vendor-invoices" element={<VendorInvoices />} />
          <Route path="vendor-payments" element={<VendorPayments />} />
          <Route path="input-gst" element={<InputGST />} />
          <Route path="vendor-tds" element={<VendorTDS />} />

        </Route>
        
        {/* Catch-all route to redirect unknown URLs to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
