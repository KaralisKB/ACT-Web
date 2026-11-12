import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// This is ACT's owned Firebase web project. These are public web app settings;
// privileged Admin SDK credentials are never included in the frontend.
const defaultProjectConfig = {
  apiKey: 'AIzaSyAAtj6znPd9AGOnOS6DJ1d1-Lq_70zPN-0',
  authDomain: 'stocks-portfolio-manager-1234.firebaseapp.com',
  projectId: 'stocks-portfolio-manager-1234',
  storageBucket: 'stocks-portfolio-manager-1234.firebasestorage.app',
  messagingSenderId: '450312499987',
  appId: '1:450312499987:web:6c80870d679b97ee61e0e6',
  measurementId: 'G-49RM6WY42Z',
};

// Set all of these in .env.local to override the project locally, or in
// Netlify's environment settings to use the same override in production.
// Select the complete config together so values from two projects cannot mix.
const firebaseConfig = process.env.REACT_APP_FIREBASE_PROJECT_ID
  ? {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    }
  : defaultProjectConfig;

const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
if (missingFields.length) {
  throw new Error(`Firebase web configuration is incomplete: ${missingFields.join(', ')}. Check your REACT_APP_FIREBASE_* environment variables.`);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
