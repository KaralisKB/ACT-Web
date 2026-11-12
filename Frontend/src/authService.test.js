import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserProfile, getAuthErrorMessage, loginUser, logoutUser, registerUser } from './authService';

jest.mock('./firebaseConfig', () => ({ auth: {}, db: {} }));
jest.mock('firebase/firestore', () => ({ doc: jest.fn(), getDoc: jest.fn(), setDoc: jest.fn() }));
jest.mock('firebase/auth', () => ({ createUserWithEmailAndPassword: jest.fn(), signInWithEmailAndPassword: jest.fn(), updateProfile: jest.fn(), signOut: jest.fn() }));
const firebaseUser = { uid: 'test-uid', email: 'tester@example.invalid', displayName: 'Test User', stsTokenManager: { accessToken: 'must-not-be-saved' } };
beforeEach(() => {
  jest.resetAllMocks();
  doc.mockReturnValue('profile-reference');
  getDoc.mockResolvedValue({ exists: () => false });
  setDoc.mockResolvedValue(undefined);
  signInWithEmailAndPassword.mockResolvedValue({ user: firebaseUser });
  createUserWithEmailAndPassword.mockResolvedValue({ user: firebaseUser });
  updateProfile.mockResolvedValue(undefined);
});

test('login trims email, preserves password, and stores a plain profile under the Firebase UID', async () => {
  const user = await loginUser(' tester@example.invalid ', ' password ');
  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'tester@example.invalid', ' password ');
  expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', 'test-uid');
  expect(setDoc).toHaveBeenCalledWith('profile-reference', user);
  expect(user).toEqual({ id: 'test-uid', uid: 'test-uid', email: 'tester@example.invalid', firstName: 'Test', lastName: 'User' });
  expect(user).not.toHaveProperty('stsTokenManager');
});

test.each([['', 'password', 'auth/invalid-email'], ['bad-email', 'password', 'auth/invalid-email'], ['tester@example.invalid', '', 'auth/missing-password']])('rejects invalid credentials before Firebase', async (email, password, code) => {
  await expect(loginUser(email, password)).rejects.toMatchObject({ code });
  expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
});

test('credential failures are reported without attempting profile writes', async () => {
  signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-credential' });
  await expect(loginUser('tester@example.invalid', 'wrong')).rejects.toMatchObject({ code: 'auth/invalid-credential' });
  expect(getDoc).not.toHaveBeenCalled();
  expect(getAuthErrorMessage({ code: 'auth/invalid-credential' })).toBe('The email or password is incorrect.');
});

test('existing profile names load while Firebase controls identity and email', async () => {
  getDoc.mockResolvedValue({ exists: () => true, data: () => ({ id: 'wrong-id', uid: 'wrong-uid', email: 'other@example.invalid', firstName: 'Saved', lastName: 'Name' }) });
  const profile = await loginUser('tester@example.invalid', 'password');
  expect(profile).toMatchObject({ id: 'test-uid', uid: 'test-uid', email: firebaseUser.email, firstName: 'Saved', lastName: 'Name' });
  expect(setDoc).not.toHaveBeenCalled();
});

test('signup trims names and creates the same profile shape as login', async () => {
  const profile = await registerUser(' tester@example.invalid ', 'password', ' Test ', ' User ');
  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'tester@example.invalid', 'password');
  expect(updateProfile).toHaveBeenCalledWith(firebaseUser, { displayName: 'Test User' });
  expect(setDoc).toHaveBeenCalledWith('profile-reference', profile);
  expect(profile).toEqual(createUserProfile(firebaseUser));
});

test('signup validates names and password before creating an account', async () => {
  await expect(registerUser('tester@example.invalid', 'password', '', 'User')).rejects.toMatchObject({ code: 'app/missing-name' });
  await expect(registerUser('tester@example.invalid', 'password', 'x'.repeat(101), 'User')).rejects.toMatchObject({ code: 'app/missing-name' });
  await expect(registerUser('tester@example.invalid', 'short', 'Test', 'User')).rejects.toMatchObject({ code: 'auth/weak-password' });
  expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
});

test('interrupted signup explains how to finish with the already-created account', async () => {
  setDoc.mockRejectedValue({ code: 'permission-denied' });
  await expect(registerUser('tester@example.invalid', 'password', 'Test', 'User')).rejects.toMatchObject({ code: 'app/setup-incomplete' });
  expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
  expect(getAuthErrorMessage({ code: 'app/setup-incomplete', message: 'Please log in later.' })).toBe('Please log in later.');
});

test('existing accounts retain login guidance', async () => {
  createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' });
  await expect(registerUser('tester@example.invalid', 'password', 'Test', 'User')).rejects.toMatchObject({ code: 'auth/email-already-in-use' });
  expect(getAuthErrorMessage({ code: 'auth/email-already-in-use' })).toContain('log in instead');
});

test('a failed profile read is not treated as successful login', async () => {
  getDoc.mockRejectedValue({ code: 'permission-denied' });
  await expect(loginUser('tester@example.invalid', 'password')).rejects.toMatchObject({ code: 'permission-denied' });
  expect(setDoc).not.toHaveBeenCalled();
});

test('logout terminates the Firebase session', async () => {
  await logoutUser();
  expect(signOut).toHaveBeenCalledTimes(1);
});
