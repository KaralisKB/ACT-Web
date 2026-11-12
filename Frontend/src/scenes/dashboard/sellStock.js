import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Typography, Avatar, Paper, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from '../../services/apiClient';
import { useNavigate, useLocation } from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";

const SellStock = () => {
    const [currentPrice, setCurrentPrice] = useState(null); // Current market price of the stock
    const [quantity, setQuantity] = useState('');
    const [total, setTotal] = useState(0); // Total earnings = price * quantity
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null); // Error message handling
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user')); // Fetch user details from localStorage
    const selectedClient = JSON.parse(localStorage.getItem('selectedClient')); // Fetch selected client from localStorage
    const { symbol, name } = location.state || {}; // Stock details from navigation state

    // Fetch the current price of the stock
    useEffect(() => {
        const fetchPrice = async () => {
            if (!symbol) { setError('Choose a stock from the watchlist first.'); return; }
            try {
                const response = await api.get(
                    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=ce80b8aad3i4pjr4v2ggce80b8aad3i4pjr4v2h0`
                );
                if (!Number.isFinite(response.data.c) || response.data.c <= 0) throw new Error("Quote unavailable");
                setCurrentPrice(response.data.c);
            } catch (err) {
                setError('Failed to fetch current stock price');
            }
        };
        fetchPrice();
    }, [symbol]);

    // Calculate the total earnings whenever quantity changes
    useEffect(() => {
        setTotal(currentPrice && quantity ? Math.round(currentPrice * Number(quantity) * 100) / 100 : 0);
    }, [currentPrice, quantity]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setError(null);

        if (!selectedClient) {
            setError("No client selected. Please select a client.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                userId: user.id,
                clientId: typeof selectedClient === "string" ? selectedClient : selectedClient.id,
                symbol,
                name,
                quantity: Number(quantity),
                price: currentPrice,
                totalEarnings: total,
            };

            // Make a transaction request for selling
            const response = await api.post(`/api/sell`, payload);

            // If successful, navigate to portfolio
            alert(response.data.message || 'Stock sold successfully');
            navigate('/portfolio');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during the transaction');
        } finally { setIsSubmitting(false); }
    };

    return (
        <Grid container component="main" sx={{ minHeight: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dHJhZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sell Stock
                    </Typography>
                    <Typography color="text.secondary">Virtual trading • Practice cash only</Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="name"
                            label="Stock Name"
                            value={name || symbol || ''}
                            disabled
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="currentPrice"
                            label="Current Price"
                            value={currentPrice ? `$${currentPrice.toFixed(2)}` : error ? 'Unavailable' : 'Loading...'}
                            disabled
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="quantity"
                            label="Quantity"
                            type="number"
                            inputProps={{ min: 1, step: 1 }}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="total"
                            label="Total Earnings"
                            value={total ? `$${total.toFixed(2)}` : '0.00'}
                            disabled
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting || !symbol || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0 || !currentPrice}
                        >
                            Sell Stock
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default SellStock;
