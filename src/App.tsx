import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Layouts
import { Layout } from './components/layout/Layout';
import { AuthLayout } from './features/auth/AuthLayout';

// Pages / Features
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { Dashboard } from './features/dashboard/Dashboard';
import { VendorsList } from './features/vendors/VendorsList';
import { VendorProfile } from './features/vendors/VendorProfile';
import { RFQsList } from './features/rfqs/RFQsList';
import { CreateRFQ } from './features/rfqs/CreateRFQ';
import { RFQDetails } from './features/rfqs/RFQDetails';
import { QuotationSubmission } from './features/quotations/QuotationSubmission';
import { QuotationComparison } from './features/quotations/QuotationComparison';
import { ApprovalWorkflow } from './features/approvals/ApprovalWorkflow';
import { PurchaseOrderView } from './features/purchase-orders/PurchaseOrderView';
import { InvoiceManagement } from './features/invoices/InvoiceManagement';
import { AuditLogs } from './features/activity-logs/AuditLogs';
import { ReportsPanel } from './features/reports/ReportsPanel';
import { LandingPage } from './features/landing/LandingPage';

function App() {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <Login />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <Register />
              </AuthLayout>
            )
          }
        />

        {/* Protected ERP Modules Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Vendors */}
          <Route
            path="/vendors"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Procurement Officer']}>
                <VendorsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Procurement Officer']}>
                <VendorProfile />
              </ProtectedRoute>
            }
          />

          {/* RFQs */}
          <Route path="/rfqs" element={<RFQsList />} />
          <Route
            path="/rfqs/create"
            element={
              <ProtectedRoute allowedRoles={['Procurement Officer']}>
                <CreateRFQ />
              </ProtectedRoute>
            }
          />
          <Route path="/rfqs/:id" element={<RFQDetails />} />

          {/* Quotations / Bidding */}
          <Route
            path="/rfqs/:rfqId/submit"
            element={
              <ProtectedRoute allowedRoles={['Vendor']}>
                <QuotationSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rfqs/:rfqId/compare"
            element={
              <ProtectedRoute allowedRoles={['Procurement Officer']}>
                <QuotationComparison />
              </ProtectedRoute>
            }
          />

          {/* Approvals */}
          <Route
            path="/approvals"
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Procurement Officer', 'Admin']}>
                <ApprovalWorkflow />
              </ProtectedRoute>
            }
          />

          {/* Purchase Orders */}
          <Route path="/purchase-orders" element={<PurchaseOrderView />} />

          {/* Invoices */}
          <Route
            path="/invoices"
            element={
              <ProtectedRoute allowedRoles={['Vendor', 'Procurement Officer', 'Admin']}>
                <InvoiceManagement />
              </ProtectedRoute>
            }
          />

          {/* Activity Logs */}
          <Route path="/activity-logs" element={<AuditLogs />} />

          {/* Reports & Analytics */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Procurement Officer', 'Manager']}>
                <ReportsPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all Wildcard Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
