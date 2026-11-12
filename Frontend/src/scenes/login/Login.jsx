import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, TextField } from '@mui/material';
import AuthLayout from '../../components/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isLoggedIn = await login(email, password);
    if (isLoggedIn) {
      navigate('../clients');
    }
  };

  return (
    <AuthLayout title="Login">
      <Box component="form" className="auth-form" onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          id="email"
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Button type="submit" disabled={isLoading} fullWidth variant="contained" className="auth-submit">
          {isLoading ? 'Logging in…' : 'Log In'}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </Box>
    </AuthLayout>
  );
};

export default Login;
