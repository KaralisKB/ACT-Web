import React, { useEffect, useState } from 'react';
import { Alert, CircularProgress, Grid, Paper } from '@mui/material';
import api from '../services/apiClient';
import NewsCard from '../Cards/NewsCard';

export default function News({ symbol, limit = 9 }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const today = new Date();
    const past = new Date(today);
    past.setUTCDate(past.getUTCDate() - 7);
    const endpoint = symbol ? `company-news?symbol=${encodeURIComponent(symbol)}&from=${past.toISOString().slice(0, 10)}&to=${today.toISOString().slice(0, 10)}` : 'news?category=general';
    api.get(`https://finnhub.io/api/v1/${endpoint}`)
      .then(response => { if (active) setNews(Array.isArray(response.data) ? response.data : []); })
      .catch(() => { if (active) setError('Market news is currently unavailable. Please try again later.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [symbol]);
  if (loading) return <CircularProgress aria-label="Loading market news" />;
  if (error) return <Alert severity="warning">{error}</Alert>;
  if (!news.length) return <Alert severity="info">No recent articles are available.</Alert>;
  return <Grid container spacing={2}>{news.slice(0, limit).map((article, index) => <Grid item xs={12} md={6} lg={4} key={article.id ?? index}><Paper sx={{ height: '100%', p: 1 }}><NewsCard data={article} /></Paper></Grid>)}</Grid>;
}
