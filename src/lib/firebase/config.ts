
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 0adf757 (pressing signin:This site can’t be reached)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const useEmulators = process.env.FIREBASE_USE_EMULATORS === 'true';

if (useEmulators) {
  // Connect to local emulators when explicitly enabled
  const emulatorProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project';
  app = !getApps().length ? initializeApp({ projectId: emulatorProjectId }) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);

  // Avoid duplicate emulator connections on hot reloads
  // @ts-ignore
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  }
  // @ts-ignore
  if (!db.INTERNAL.emulator) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
} else {
  // Default to live Firebase services in all environments
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
=======
app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
auth = getAuth(app);
db = getFirestore(app);
=======
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = initializeFirestore(app, {
=======
function initializeServices() {
  const isConfigured = getApps().length > 0;
  const app = isConfigured ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = initializeFirestore(app, {
    localCache:
      typeof window !== 'undefined'
        ? persistentLocalCache({})
        : memoryLocalCache({}),
>>>>>>> aa2cd26 (it was already enabled)
=======
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({}),
>>>>>>> 0adf757 (pressing signin:This site can’t be reached)
    ignoreUndefinedProperties: true,
  });
>>>>>>> 92303be (Unhandled Runtime Error)

  if (process.env.NODE_ENV === 'development') {
    console.log('Connecting to emulators');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  }
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 628f8e0 (Try fixing this error: `Unhandled Runtime Error: TypeError: undefined is)
=======

<<<<<<< HEAD
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
>>>>>>> 92303be (Unhandled Runtime Error)
=======
  return { app, auth, db };
>>>>>>> aa2cd26 (it was already enabled)
=======
} else if (getApps().length) {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
>>>>>>> 0adf757 (pressing signin:This site can’t be reached)
}

// This is a server-only initialization for things like server components
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
}


export { app, db, auth };
