import { createContext, useReducer, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { createUserProfile } from '../authService';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': return { user: action.payload, authReady: true };
    case 'LOGOUT': return { user: null, authReady: true };
    default: return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, authReady: false });

  useEffect(() => {
    return onAuthStateChanged(auth, firebaseUser => {
        let cached = null;
        try { cached = JSON.parse(localStorage.getItem('user')); } catch { /* Replace invalid cached sessions. */ }
        if (firebaseUser) {
          const profile = createUserProfile(firebaseUser, cached?.uid === firebaseUser.uid ? cached : {});
          // Firebase identity is authoritative when switching projects or accounts.
          profile.id = firebaseUser.uid;
          if (cached?.uid !== firebaseUser.uid) localStorage.removeItem('selectedClient');
          localStorage.setItem('user', JSON.stringify(profile));
          dispatch({ type: 'LOGIN', payload: profile });
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('selectedClient');
          dispatch({ type: 'LOGOUT' });
        }
      });

  }, []);

  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthContextProvider');
  return context;
};
