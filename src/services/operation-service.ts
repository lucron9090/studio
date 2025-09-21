
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Operation, ConversationMessage } from '@/lib/types';


// Create a new operation for a user
export async function createOperation(userId: string, operationData: Omit<Operation, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'operations'), {
    ...operationData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  // Add initial system message
  await addMessage(docRef.id, {
    author: 'system',
    content: 'Operation created. The initial prompt is ready to be sent.'
  })

  return docRef.id;
}

// Get all operations for a user
export async function getOperations(userId: string): Promise<Operation[]> {
  const q = query(collection(db, 'operations'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  const operations: Operation[] = [];
  querySnapshot.forEach((doc) => {
    operations.push({ id: doc.id, ...doc.data() } as Operation);
  });
  
  return operations;
}


// Get a single operation
export async function getOperation(operationId: string): Promise<Operation | null> {
    const docRef = doc(db, 'operations', operationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Operation;
    } else {
        return null;
    }
}

// Update an operation
export async function updateOperation(operationId: string, updates: Partial<Operation>) {
    const docRef = doc(db, 'operations', operationId);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

// Add a message to an operation's conversation
export async function addMessage(operationId: string, messageData: Omit<ConversationMessage, 'id' | 'timestamp'>) {
    const messagesRef = collection(db, 'operations', operationId, 'messages');
    const docRef = await addDoc(messagesRef, {
        ...messageData,
        timestamp: serverTimestamp(),
    });
    return docRef.id;
}


// Get all messages for an operation's conversation
export function getMessages(operationId: string, callback: (messages: ConversationMessage[]) => void) {
    const messagesRef = collection(db, 'operations', operationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages: ConversationMessage[] = [];
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as ConversationMessage);
        });
        callback(messages);
    });

    return unsubscribe;
}


// Delete an operation and all its messages
export async function deleteOperation(operationId: string): Promise<void> {
  const operationRef = doc(db, 'operations', operationId);
  const messagesRef = collection(db, 'operations', operationId, 'messages');

  // Delete all messages in the subcollection
  const messagesSnapshot = await getDocs(messagesRef);
  const batch = writeBatch(db);
  messagesSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Delete the operation document
  await deleteDoc(operationRef);
}
