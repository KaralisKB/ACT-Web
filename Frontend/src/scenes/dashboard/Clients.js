import React, { useCallback, useEffect, useState } from 'react';
import './Clients.scss';
import { Alert, AppBar, Box, Button, CircularProgress, Grid, Modal, TextField, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/apiClient';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import Copyright from '../../global/Copyright';
import clientImage from './client.png';

const Clients = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/clients/${user.id}`);
      setClients(response.data.clients || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Your clients could not be loaded. Please try again.');
    } finally { setLoading(false); }
  }, [user.id]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const addClient = async event => {
    event.preventDefault();
    if (!newClientName.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await api.post(`/api/clients/add/${user.id}`, { clientName: newClientName.trim() });
      setNewClientName('');
      setShowModal(false);
      await fetchClients();
    } catch (err) {
      setError(err.response?.data?.error || 'The client could not be created. Please try again.');
    } finally { setSaving(false); }
  };

  const openClient = client => {
    localStorage.setItem('selectedClient', JSON.stringify(client.id));
    navigate('/home');
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#141b2d', color: 'white' }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>Client Management</Typography>
          <Button color="inherit" onClick={() => setShowModal(true)}>Add Client</Button>
          <Button color="inherit" onClick={async () => { await logout(); navigate('/login'); }}>Log out</Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 3, md: 5 }, flex: 1 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>Your Clients</Typography>
        <Typography sx={{ mb: 4, color: '#c6cde0' }}>Choose a virtual client to open the stock dashboard.</Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" onClick={fetchClients}>Retry</Button>}>{error}</Alert>}
        {loading ? <CircularProgress color="secondary" aria-label="Loading clients" /> : clients.length === 0 ? (
          <Box sx={{ p: 4, border: '1px solid #44506c', borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 1 }}>Create your first virtual client</Typography>
            <Typography sx={{ mb: 3 }}>Each new client starts with $100,000 in virtual cash to practise trading.</Typography>
            <Button variant="contained" color="secondary" onClick={() => setShowModal(true)}>Create Client</Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {clients.map(client => (
              <Grid item xs={12} sm={6} md={4} key={client.id}>
                <Box component="button" className="client-tile" onClick={() => openClient(client)} sx={{ width: '100%', border: 0, color: 'white', font: 'inherit' }}>
                  <img className="client-image" src={clientImage} alt="" style={{ width: '100%', maxWidth: 230, height: 180, objectFit: 'cover' }} />
                  <Typography variant="h4" className="client-name" sx={{ mt: 2 }}>{client.name}</Typography>
                  <Typography sx={{ color: '#b9c3da', my: 1 }}>Virtual cash: ${((client.balanceCents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                  <Typography color="secondary">Open Dashboard →</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Modal open={showModal} onClose={() => { if (!saving) setShowModal(false); }} aria-labelledby="new-client-title">
        <Box component="form" onSubmit={addClient} className="modal-box" sx={{ width: 'min(400px, calc(100vw - 32px))' }}>
          <Typography id="new-client-title" variant="h4" sx={{ mb: 2 }}>Add New Client</Typography>
          <Typography sx={{ mb: 2 }}>Starting balance: $100,000 virtual cash.</Typography>
          <TextField required autoFocus label="Client Name" fullWidth value={newClientName} onChange={event => setNewClientName(event.target.value)} inputProps={{ maxLength: 100 }} sx={{ borderRadius: 1 }} />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button type="submit" disabled={saving || !newClientName.trim()} variant="contained" color="secondary">{saving ? 'Creating…' : 'Create'}</Button>
            <Button disabled={saving} color="inherit" onClick={() => setShowModal(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
      <Copyright sx={{ color: '#c6cde0', py: 3 }} />
    </Box>
  );
};
export default Clients;
