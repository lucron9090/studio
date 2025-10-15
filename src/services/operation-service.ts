
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

// Helper function to remove undefined properties from an object
const removeUndefined = (obj: Record<string, any>) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};


// Create a new operation for a user
export async function createOperation(userId: string, operationData: Omit<Operation, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
  if (!userId) {
    throw new Error('User must be authenticated to create operations');
  }
  
  const cleanedOperationData = removeUndefined(operationData);

  try {
    const docRef = await addDoc(collection(db, 'operations'), {
      ...cleanedOperationData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Add initial system message
    await addMessage(docRef.id, {
      operationId: docRef.id,
      role: 'strategist',
      content: 'Operation created. The initial prompt is ready to be sent.'
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating operation:', error);
    throw new Error(`Failed to create operation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
export async function getOperation(operationId: string, userId?: string): Promise<Operation | null> {
    const docRef = doc(db, 'operations', operationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const operation = { id: docSnap.id, ...docSnap.data() } as Operation;
        
        // If userId is provided, verify the user owns this operation
        if (userId && operation.userId !== userId) {
            throw new Error('Access denied: You do not have permission to access this operation');
        }
        
        return operation;
    } else {
        return null;
    }
}

// Update an operation
export async function updateOperation(operationId: string, updates: Partial<Operation>) {
    const docRef = doc(db, 'operations', operationId);
    const cleanedUpdates = removeUndefined(updates);
    await updateDoc(docRef, {
        ...cleanedUpdates,
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
    }, (error) => {
        console.error('Error listening to messages:', error);
        // Firestore security rules will reject unauthorized access
        if (error.code === 'permission-denied') {
            console.error('Permission denied: User may not have access to this operation');
        }
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
