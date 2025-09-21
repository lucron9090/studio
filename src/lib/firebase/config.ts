
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  type Firestore,
  initializeFirestore,
  persistentLocalCache,
  memoryLocalCache 
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function initializeServices() {
  const isConfigured = getApps().length > 0;
  const app = isConfigured ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = initializeFirestore(app, {
    localCache:
      typeof window !== 'undefined'
        ? persistentLocalCache({})
        : memoryLocalCache({}),
    ignoreUndefinedProperties: true,
  });

  if (process.env.NODE_ENV === 'development') {
    if (!isConfigured) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
      } catch (e) {
        console.log('Emulators already running or failed to connect.');
      }
    }
  }

  return { app, auth, db };
}

function getFirebaseServices() {
  return initializeServices();
}

const { app, auth, db } = getFirebaseServices();
export { app, db, auth };
