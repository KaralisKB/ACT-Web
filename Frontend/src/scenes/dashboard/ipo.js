import React, { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import api from '../../services/apiClient';
import Header from '../../components/Headers';

export default function IPO() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const today = new Date();
    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() + 90);
    api.get(`https://finnhub.io/api/v1/calendar/ipo?from=${today.toISOString().slice(0, 10)}&to=${end.toISOString().slice(0, 10)}`)
      .then(response => { if (active) setRows((response.data.ipoCalendar || []).map((record, id) => ({ ...record, id }))); })
      .catch(() => { if (active) setError('The IPO calendar is currently unavailable. Please try again later.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const columns = [['date', 'Date'], ['exchange', 'Exchange'], ['name', 'Name'], ['numberOfShares', 'Number of Shares'], ['price', 'Price (USD)'], ['status', 'Status'], ['symbol', 'Symbol'], ['totalSharesValue', 'Total Shares Value']].map(([field, headerName]) => ({ field, headerName, flex: 1, minWidth: field === 'name' ? 220 : 140 }));
  return <Box m="20px">
    <Header title="IPO" subtitle="Upcoming IPOs over the next 90 days" />
    {error && <Alert severity="warning">{error}</Alert>}
    {!loading && !error && rows.length === 0 && <Alert severity="info">No upcoming IPOs were returned for this period.</Alert>}
    <Box mt={4} height="70vh"><DataGrid rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} /></Box>
  </Box>;
}
