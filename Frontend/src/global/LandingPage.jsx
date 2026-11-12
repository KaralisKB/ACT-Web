import * as React from 'react';
import './LandingPage.scss';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import Copyright from './Copyright';

const tradingImages = [
  {
    src: 'https://media.istockphoto.com/id/943292690/photo/financial-and-technical-data-analysis-graph-showing-stock-market-trends.jpg?s=612x612&w=0&k=20&c=pPx6ScJIqxo60fAExwJRIzYNQ_Jd-l-L78yUIJEzfAY=',
    alt: 'Stock market trends and financial data',
  },
  {
    src: 'https://wallpaperaccess.com/full/1393720.jpg',
    alt: 'Stock prices and market performance',
  },
  {
    src: 'https://the-tech-trend.com/wp-content/uploads/2021/02/How-to-read-Candlestick-Trading-Charts-A-Complete-Guide-for-Beginners.jpg',
    alt: 'Candlestick trading chart',
  },
  {
    src: 'https://media.istockphoto.com/photos/close-up-image-of-a-stock-market-graph-picture-id1213574690?b=1&k=20&m=1213574690&s=612x612&w=0&h=N2lNvavpoTFOjBHIVbKd2BmFj9Q3wjqEpxT5AASB50M=',
    alt: 'Close-up of a stock market graph',
  },
];

export default function LandingPage() {
  return (
    <Box className="landing-page">
      <AppBar position="static">
        <Toolbar className="landing-toolbar">
          <Link className="landing-brand" to="/">
            <EqualizerIcon aria-hidden="true" />
            <Typography component="span" variant="h6">
              Stock Portfolio Management
            </Typography>
          </Link>
          <Box component="nav" aria-label="Account" className="landing-nav">
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Signup</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <main className="landing-hero">
        <div className="landing-copy">
          <h1 className="stocksTransform" aria-label="Invest in US Stocks">
            Invest in
            <span className="landing-words" aria-hidden="true">
              {['US Stocks', 'IPO', 'Future', 'Yourself', 'Options'].map((word) => (
                <span key={word}>{word}</span>
              ))}
            </span>
          </h1>
          <p className="landing-description">
            Real markets • Virtual money • Powered by AI
          </p>
        </div>

        <div className="landing-images">
          {tradingImages.map(({ src, alt }) => (
            <img key={src} src={src} alt={alt} width="280" height="210" />
          ))}
        </div>
      </main>

      <Box component="footer" className="landing-footer">
        <Copyright sx={{ color: 'white' }} />
      </Box>
    </Box>
  );
}
