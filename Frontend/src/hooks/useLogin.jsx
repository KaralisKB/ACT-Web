import { useState } from 'react';
import { useAuthContext } from './useAuthContext.jsx';
import { getAuthErrorMessage, loginUser } from '../authService';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await loginUser(email, password);
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

  return { login, error, isLoading };
};
