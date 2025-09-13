import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (process.env.NODE_ENV === 'development') {
  // Use emulators in development
  app = !getApps().length ? initializeApp({ projectId: 'demo-project' }) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Check if emulators are already running to avoid re-connecting
  // The host property is a private property, but it's a reliable way to check
  // if the emulator is already connected.
  // @ts-ignore
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  }
  // @ts-ignore
  if (!db.INTERNAL.emulator) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }

} else {
  // Use live Firebase services in production
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}


export { app, db, auth };
