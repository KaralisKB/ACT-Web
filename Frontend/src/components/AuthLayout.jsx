import { Avatar, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import './AuthLayout.scss';

export default function AuthLayout({ title, children }) {
  return (
    <Box className="auth-page">
      <header className="auth-header">
        <Link to="/">Stock Portfolio Manager</Link>
      </header>
      <main className="auth-main">
        <div className="auth-visual">
          <img
            src="https://www.jonesday.com/-/media/images/news/2021/07/spoofing_and_disruptive_trading_social.jpg"
            alt="Stock market graph"
            width="900"
            height="600"
          />
        </div>
        <section className="auth-card" aria-labelledby="auth-title">
          <Avatar className="auth-icon">
            <LockOutlinedIcon />
          </Avatar>
          <Typography id="auth-title" component="h1" className="auth-title">
            {title}
          </Typography>
          {children}
        </section>
      </main>
    </Box>
  );
}
