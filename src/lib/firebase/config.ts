
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  type Firestore,
  initializeFirestore,
  enableIndexedDbPersistence 
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

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
    ignoreUndefinedProperties: true,
  });
>>>>>>> 92303be (Unhandled Runtime Error)

  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn(
        'Multiple tabs open, persistence can only be enabled in one tab at a time.'
      );
    } else if (err.code == 'unimplemented') {
      console.warn(
        'The current browser does not support all of the features required to enable persistence.'
      );
    }
  });

  if (process.env.NODE_ENV === 'development') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (e) {
      console.log('Emulators already running or failed to connect.');
    }
  }
<<<<<<< HEAD
>>>>>>> 628f8e0 (Try fixing this error: `Unhandled Runtime Error: TypeError: undefined is)
=======

} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
>>>>>>> 92303be (Unhandled Runtime Error)
}

export { app, db, auth };
