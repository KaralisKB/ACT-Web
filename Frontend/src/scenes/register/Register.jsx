import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, TextField } from '@mui/material';
import AuthLayout from '../../components/AuthLayout';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSignedUp = await signup(firstName, lastName, email, password);
    if (isSignedUp) {
      navigate('/clients');
    } else {
      console.error('Signup failed. Check error messages above.');
    }
  };

  return (
    <AuthLayout title="Sign Up">
      <Box component="form" className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-name-fields">
          <TextField
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>
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
          autoComplete="new-password"
          inputProps={{ minLength: 6 }}
          helperText="Use at least 6 characters."
        />
        <Button type="submit" disabled={isLoading} fullWidth variant="contained" className="auth-submit">
          {isLoading ? 'Creating account…' : 'Sign Up'}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </Box>
    </AuthLayout>
  );
};

export default Register;
