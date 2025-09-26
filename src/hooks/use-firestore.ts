
'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useFirestore() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!db) {
        setIsOnline(false);
        return;
    }

    // Firestore's backend is not directly exposed to check online status.
    // A common workaround is to listen to the metadata of a document.
    // The `.metadata.fromCache` property is false when data is from the server.
    const unsub = onSnapshot(doc(db, 'operations', '__test_doc__'), (doc) => {
        setIsOnline(!doc.metadata.fromCache);
    }, (error) => {
        // If we can't even listen to a document, we are likely offline.
        setIsOnline(false);
    });

    // Another check can be to see if `enableNetwork` and `disableNetwork`
    // have any effect, but that is more intrusive.
    // The onSnapshot is a good passive way to check connectivity.

    return () => unsub();

  }, []);

  return { isOnline };
}
