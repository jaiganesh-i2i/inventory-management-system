import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProductsPage from './pages/Products/ProductsPage';
import UsersPage from './pages/Users/UsersPage';
import TransactionsPage from './pages/Transactions/TransactionsPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import WarehousesPage from './pages/Warehouses/WarehousesPage';
import ReportsPage from './pages/Reports/ReportsPage';
import AlertsPage from './pages/Alerts/AlertsPage';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Wrapper component that combines ProtectedRoute with MainLayout
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/inventory"
          element={
            <ProtectedLayout>
              <InventoryPage />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/products"
          element={
            <ProtectedLayout>
              <ProductsPage />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/transactions"
          element={
            <ProtectedLayout>
              <TransactionsPage />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/categories"
          element={
            <ProtectedLayout>
              <CategoriesPage />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/warehouses"
          element={
            <ProtectedLayout>
              <WarehousesPage />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/reports"
          element={
            <ProtectedLayout>
              <ReportsPage />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/alerts"
          element={
            <ProtectedLayout>
              <AlertsPage />
            </ProtectedLayout>
          }
        />
        
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
