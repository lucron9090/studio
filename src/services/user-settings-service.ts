'use server';

import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

if (!ENCRYPTION_SECRET) {
  throw new Error('ENCRYPTION_SECRET is not set. Please check your environment variables.');
}

function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_SECRET).toString();
}

function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function saveUserSettings(userId: string, settings: { openaiApiKey: string }): Promise<void> {
  const userSettingsRef = doc(db, 'userSettings', userId);
  const encryptedApiKey = encrypt(settings.openaiApiKey);
  await setDoc(userSettingsRef, { openaiApiKey: encryptedApiKey }, { merge: true });
}

export async function getUserSettings(userId: string): Promise<{ openaiApiKey: string } | null> {
  const userSettingsRef = doc(db, 'userSettings', userId);
  const docSnap = await getDoc(userSettingsRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const encryptedApiKey = data.openaiApiKey;
    if (encryptedApiKey) {
      const decryptedApiKey = decrypt(encryptedApiKey);
      return { openaiApiKey: decryptedApiKey };
    }
  }

  return null;
}
