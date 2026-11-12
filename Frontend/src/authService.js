import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

function authError(code, message) {
  return Object.assign(new Error(message), { code });
}

export function getAuthErrorMessage(error) {
  const messages = {
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/missing-password': 'Enter your password.',
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/user-not-found': 'The email or password is incorrect.',
    'auth/wrong-password': 'The email or password is incorrect.',
    'auth/email-already-in-use': 'This email already has an account. Please log in instead.',
    'auth/weak-password': 'Choose a password with at least 6 characters.',
    'auth/password-does-not-meet-requirements': 'Your password does not meet the account security requirements.',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'Unable to connect. Check your internet connection and try again.',
    'auth/operation-not-allowed': 'Email and password sign-in is not enabled. Please contact the app owner.',
    'auth/invalid-api-key': 'Sign-in is not configured correctly. Please contact the app owner.',
    'auth/user-disabled': 'This account has been disabled. Please contact the app owner.',
    'permission-denied': 'Your account profile could not be accessed. Please contact the app owner.',
    'unavailable': 'The database is temporarily unavailable. Please try again later.',
  };
  if (messages[error?.code]) return messages[error.code];
  if (error?.code?.startsWith('app/')) return error.message;
  return 'Something went wrong while signing in. Please try again.';
}

function validateCredentials(email, password) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw authError('auth/invalid-email', 'Enter a valid email address.');
  }
  if (!password) throw authError('auth/missing-password', 'Enter your password.');
}

// Store app profile data only, with the same shape after login and signup.
export function createUserProfile(firebaseUser, profile = {}) {
  if (!profile || typeof profile !== 'object') profile = {};
  const displayName = firebaseUser.displayName || '';
  const [firstName = '', ...lastName] = displayName.split(' ');
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    firstName: String(profile.firstName ?? firstName).slice(0, 100),
    lastName: String(profile.lastName ?? lastName.join(' ')).slice(0, 100),
  };
}

async function getFirebaseProfile(user, names) {
  const reference = doc(db, 'users', user.uid);
  const snapshot = await getDoc(reference);
  if (snapshot.exists()) {
    return createUserProfile(user, { ...snapshot.data(), id: user.uid });
  }
  const profile = createUserProfile(user, names);
  await setDoc(reference, profile);
  return profile;
}

export async function loginUser(email, password) {
  const cleanEmail = email.trim();
  validateCredentials(cleanEmail, password);
  const { user } = await signInWithEmailAndPassword(auth, cleanEmail, password);
  return getFirebaseProfile(user);
}

export async function registerUser(email, password, firstName, lastName) {
  const cleanEmail = email.trim();
  const names = { firstName: firstName.trim(), lastName: lastName.trim() };
  validateCredentials(cleanEmail, password);
  if (!names.firstName || !names.lastName || names.firstName.length > 100 || names.lastName.length > 100) {
    throw authError('app/missing-name', 'Enter your first and last name (up to 100 characters each).');
  }
  if (password.length < 6) throw authError('auth/weak-password', 'Choose a password with at least 6 characters.');

  let accountCreated = false;
  try {
    const { user } = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    accountCreated = true;
    await updateProfile(user, { displayName: `${names.firstName} ${names.lastName}` });
    return await getFirebaseProfile(user, names);
  } catch (error) {
    if (accountCreated) {
      // Do not delete an account or repeatedly attempt to create it after an API failure.
      throw authError('app/setup-incomplete', 'Your sign-in account was created, but account setup could not finish. Please try logging in later instead of signing up again.');
    }
    throw error;
  }
}

export const logoutUser = () => signOut(auth);
