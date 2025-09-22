
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  type Firestore,
  initializeFirestore,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

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

if (typeof window !== 'undefined') {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
    });

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

  } else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
} else {
    // Server-side initialization
   if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
}


export { app, db, auth };
