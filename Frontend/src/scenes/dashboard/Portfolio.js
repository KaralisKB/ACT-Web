import React, { useEffect, useState } from 'react';
import { Alert, Box, Paper, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/apiClient';
import Header from '../../components/Headers';

const money = value => value == null ? 'Unavailable' : `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Portfolio() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [missingQuotes, setMissingQuotes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const client = JSON.parse(localStorage.getItem('selectedClient'));
        const clientId = typeof client === 'string' ? client : client.id;
        const response = await api.get(`/api/portfolio/${user.id}/${clientId}`);
        const holdings = await Promise.all((response.data.portfolio || []).map(async stock => {
          const investedAmount = (stock.costBasisCents ?? Math.round(stock.quantity * stock.averagePrice * 100)) / 100;
          let currentPrice = null;
          try {
            const quote = await api.get(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(stock.symbol)}`);
            if (Number.isFinite(quote.data.c) && quote.data.c > 0) currentPrice = quote.data.c;
          } catch { /* Preserve the holding and cost basis when market data is unavailable. */ }
          const currentAmount = currentPrice == null ? null : stock.quantity * currentPrice;
          return { ...stock, investedAmount, currentPrice, currentAmount, profitLoss: currentAmount == null ? null : currentAmount - investedAmount };
        }));
        if (active) {
          setRows(holdings);
          setMissingQuotes(holdings.some(stock => stock.currentPrice == null));
        }
      } catch (err) {
        if (active) setError(err.response?.data?.error || 'Your portfolio could not be loaded. Please try again.');
      } finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, []);

  const invested = rows.reduce((sum, row) => sum + row.investedAmount, 0);
  const current = missingQuotes ? null : rows.reduce((sum, row) => sum + row.currentAmount, 0);
  const columns = [
    { field: 'name', headerName: 'Company Name', flex: 1, minWidth: 170 },
    { field: 'symbol', headerName: 'Symbol', minWidth: 100 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', minWidth: 100 },
    ...[['averagePrice', 'Average Price'], ['currentPrice', 'Current Price'], ['investedAmount', 'Invested Amount'], ['currentAmount', 'Current Amount'], ['profitLoss', 'Profit/Loss']].map(([field, headerName]) => ({ field, headerName, type: 'number', minWidth: 145, flex: 1, valueFormatter: params => money(params.value) })),
    { field: 'sell', headerName: 'Sell', sortable: false, renderCell: params => <Button variant="outlined" color="error" onClick={() => navigate('/sellStock', { state: params.row })}>Sell</Button> },
  ];

  return <Box m="20px">
    <Header title="Portfolio" subtitle="Your virtual holdings • USD" />
    {error && <Alert severity="error">{error}</Alert>}
    {missingQuotes && <Alert severity="warning" sx={{ mb: 2 }}>Some market prices are unavailable. Your holdings are saved; current value and profit will appear when quotes return.</Alert>}
    <Paper sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {[['Invested Amount', invested], ['Current Amount', current], ['Profit/Loss', current == null ? null : current - invested]].map(([label, value]) => <Box key={label}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography variant="h3">{error || loading ? '—' : money(value)}</Typography>
      </Box>)}
    </Paper>
    <Box mt={4} height="65vh"><DataGrid rows={rows} columns={columns} loading={loading} components={{ Toolbar: GridToolbar }} /></Box>
  </Box>;
}
