import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export function RequireAuth() {
  const { user, authReady } = useAuthContext();
  if (!authReady) return <Box display="flex" justifyContent="center" p={6}><CircularProgress aria-label="Loading your account" /></Box>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireClient() {
  let client;
  try { client = JSON.parse(localStorage.getItem('selectedClient')); } catch { client = null; }
  return (typeof client === 'string' ? client : client?.id) ? <Outlet /> : <Navigate to="/clients" replace />;
}
