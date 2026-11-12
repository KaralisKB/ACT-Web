import { useState } from 'react';
import { useAuthContext } from './useAuthContext.jsx';
import { getAuthErrorMessage, registerUser } from '../authService';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await registerUser(email, password, firstName, lastName);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('selectedClient');
      dispatch({ type: 'LOGIN', payload: user });
      return true;
    } catch (err) {
      setError(getAuthErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, error, isLoading };
};
