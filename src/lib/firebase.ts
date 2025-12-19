// src/lib/firebase.ts

import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  Auth,
  User as FirebaseUser,
  Unsubscribe,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Firestore,
  DocumentData,
  Timestamp,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

// --- INTERFACES ---

export interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  projects: string[];
  subscriptionType?: 'free' | 'premium';
  chatUsage?: {
    count: number;
    lastCheckedDate: string; // Format: YYYY-MM-DD
  };
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
}

export interface ProjectDocument {
  id: string;
  name: string;
  prompt: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  visibility: 'public' | 'private';
  mode: 'sketch' | 'voice';
}

export interface ChatMessage {
  id: string; // The Firestore document ID
  version: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Timestamp;
  appArchitecture?: string;
  appCode?: string;
}

export interface DeploymentInfo {
  projectId: string;
  url: string;
  siteName: string;
  deployId: string;
  siteId: string;
  deployedAt: Timestamp;
}

export interface ChatLimitStatus {
  canSendMessage: boolean;
  remaining: number;
  total: number;
  isPremium: boolean;
  resetsAt: Date;
}

// --- FIREBASE INITIALIZATION ---

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting authentication persistence:", error);
  });


// --- AUTHENTICATION FUNCTIONS ---

export const subscribeToAuthChanges = (callback: (user: AppUser | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
      });
    } else {
      callback(null);
    }
  });
};

export const createUserDocument = async (user: FirebaseUser): Promise<void> => {
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const newUser: Omit<UserDocument, 'projects'> = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp() as Timestamp,
      lastLogin: serverTimestamp() as Timestamp,
    };
    await setDoc(userDocRef, { ...newUser, projects: [] });
  } else {
    await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
  }
};

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserDocument(result.user);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};


// --- FIRESTORE FUNCTIONS ---

const firebaseRequestCache = new Map<string, Promise<unknown>>();

function createFirebaseCacheKey(operation: string, ...params: unknown[]): string {
  return `firebase_${operation}:${JSON.stringify(params)}`;
}

async function executeFirebaseWithDeduplication<T>(
  cacheKey: string,
  executionFunction: () => Promise<T>
): Promise<T> {
  if (firebaseRequestCache.has(cacheKey)) {
    //console.log(`Reusing existing Firebase request for: ${cacheKey}`);
    return firebaseRequestCache.get(cacheKey) as Promise<T>;
  }

  const requestPromise = executionFunction().finally(() => {
    firebaseRequestCache.delete(cacheKey);
  });

  firebaseRequestCache.set(cacheKey, requestPromise);
  
  return requestPromise;
}

function createContentHash(content: string, type: string, version: number): string {
  // Use TextEncoder to handle Unicode characters properly
  const text = `${type}_${version}_${content}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Convert to base64 safely
  const base64 = btoa(String.fromCharCode(...Array.from(data)));
  return base64.replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
}

export const saveChatMessage = async (
  projectId: string,
  message: {
    version: number;
    type: 'user' | 'bot';
    content: string;
    appArchitecture?: string;
    appCode?: string;
  }
): Promise<string> => {
  if (!projectId) throw new Error("Project ID is required to save a message.");
  
  const contentHash = createContentHash(message.content, message.type, message.version);
  const cacheKey = createFirebaseCacheKey('saveChatMessage', projectId, contentHash, message.type, message.version);
  
  return executeFirebaseWithDeduplication(cacheKey, async () => {
    try {
      const chatRef = collection(db, 'projects', projectId, 'chat');
      
      const dataToSave: DocumentData = {
        version: message.version,
        type: message.type,
        content: message.content,
        timestamp: serverTimestamp(),
      };
      if (message.appArchitecture) {
        dataToSave.appArchitecture = message.appArchitecture;
      }
      if (message.appCode) {
        dataToSave.appCode = message.appCode;
      }

      const docRef = await addDoc(chatRef, dataToSave);
      await updateDoc(docRef, { id: docRef.id });

      if (message.appCode) {
        const previewDocRef = doc(db, 'preview', projectId);
        await setDoc(previewDocRef, {
          projectId,
          code: message.appCode,
          timestamp: serverTimestamp(),
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  });
};

export const createProject = async (
  prompt: string,
  visibility: 'public' | 'private' = 'public',
  mode: 'sketch' | 'voice' = 'sketch'
): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to create a project');

  const cacheKey = createFirebaseCacheKey('createProject', user.uid, prompt, visibility, mode);
  
  return executeFirebaseWithDeduplication(cacheKey, async () => {
    try {
      const projectName = prompt.length > 50 ? `${prompt.substring(0, 47)}...` : prompt;
      const projectsRef = collection(db, 'projects');
      const docRef = await addDoc(projectsRef, {
        name: projectName,
        prompt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
        visibility,
        mode,
      });
      
      await updateDoc(docRef, { id: docRef.id });

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const currentProjects = userDoc.data().projects || [];
        await updateDoc(userDocRef, { projects: [...currentProjects, docRef.id] });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  });
};

export const getProject = async (projectId: string): Promise<ProjectDocument | null> => {
  if (!projectId) {
    console.warn("getProject called with no projectId.");
    return null;
  }
  try {
    const projectDocRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectDocRef);
    if (projectDoc.exists()) {
      return { id: projectDoc.id, ...projectDoc.data() } as ProjectDocument;
    }
    console.log(`Project with ID ${projectId} not found.`);
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const updateProjectName = async (projectId: string, name: string): Promise<void> => {
  if (!projectId) throw new Error("Project ID is required for update.");
  try {
    const projectDocRef = doc(db, 'projects', projectId);
    await updateDoc(projectDocRef, { name, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error updating project name:', error);
    throw error;
  }
};

export const getChatHistory = async (projectId: string): Promise<ChatMessage[]> => {
  if (!projectId) return [];
  try {
    const chatRef = collection(db, 'projects', projectId, 'chat');
    const q = query(chatRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id, // Use the document ID
        version: data.version,
        type: data.type,
        content: data.content,
        timestamp: data.timestamp,
        appArchitecture: data.appArchitecture,
        appCode: data.appCode,
      } as ChatMessage;
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Add a function to check if chat exists
export const chatExists = async (projectId: string): Promise<boolean> => {
  if (!projectId) return false;
  try {
    const chatRef = collection(db, 'projects', projectId, 'chat');
    const q = query(chatRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if chat exists:', error);
    return false;
  }
};

export const getUserProjects = async (userId: string): Promise<ProjectDocument[]> => {
  if (!userId) return [];
  
  const cacheKey = createFirebaseCacheKey('getUserProjects', userId);
  
  return executeFirebaseWithDeduplication(cacheKey, async () => {
    try {
      // Get user document to get project IDs
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        return [];
      }
      
      const userData = userDoc.data();
      const projectIds = userData.projects || [];
      
      if (projectIds.length === 0) {
        return [];
      }
      
      // Fetch all projects for this user
      const projectPromises = projectIds.map(async (projectId: string) => {
        const projectDocRef = doc(db, 'projects', projectId);
        const projectDoc = await getDoc(projectDocRef);
        if (projectDoc.exists()) {
          return { id: projectDoc.id, ...projectDoc.data() } as ProjectDocument;
        }
        return null;
      });
      
      const projects = await Promise.all(projectPromises);
      return projects.filter((project): project is ProjectDocument => project !== null);
    } catch (error) {
      console.error('Error fetching user projects:', error);
      return [];
    }
  });
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to delete a project');

  const cacheKey = createFirebaseCacheKey('deleteProject', projectId, user.uid);
  
  return executeFirebaseWithDeduplication(cacheKey, async () => {
    try {
      // First, delete all chat messages in the project
      const chatRef = collection(db, 'projects', projectId, 'chat');
      const chatQuery = query(chatRef, orderBy('timestamp', 'asc'));
      const chatSnapshot = await getDocs(chatQuery);
      
      const deletePromises = chatSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete the project document
      const projectDocRef = doc(db, 'projects', projectId);
      await deleteDoc(projectDocRef);

      // Remove project ID from user's projects array
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const currentProjects = userDoc.data().projects || [];
        const updatedProjects = currentProjects.filter((id: string) => id !== projectId);
        await updateDoc(userDocRef, { projects: updatedProjects });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  });
};

export const saveDeploymentInfo = async (projectId: string, deploymentData: {
  url: string;
  siteName: string;
  deployId: string;
  siteId: string;
}): Promise<void> => {
  if (!projectId) throw new Error("Project ID is required to save deployment info.");
  
  try {
    const deploymentDocRef = doc(db, 'deployments', projectId);
    await setDoc(deploymentDocRef, {
      projectId,
      url: deploymentData.url,
      siteName: deploymentData.siteName,
      deployId: deploymentData.deployId,
      siteId: deploymentData.siteId,
      deployedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving deployment info:', error);
    throw error;
  }
};

export const getDeploymentInfo = async (projectId: string): Promise<DeploymentInfo | null> => {
  if (!projectId) return null;
  
  try {
    const deploymentDocRef = doc(db, 'deployments', projectId);
    const deploymentDoc = await getDoc(deploymentDocRef);
    
    if (deploymentDoc.exists()) {
      return deploymentDoc.data() as DeploymentInfo;
    }
    return null;
  } catch (error) {
    console.error('Error fetching deployment info:', error);
    return null;
  }
};

export const getLatestGeneratedCode = async (projectId: string): Promise<string | null> => {
  if (!projectId) return null;
  
  try {
    const chatRef = collection(db, 'projects', projectId, 'chat');
    const q = query(chatRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    // Find the most recent message with appCode
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (data.appCode && data.type === 'bot') {
        return data.appCode;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching latest generated code:', error);
    return null;
  }
};

const FREE_TIER_DAILY_LIMIT = 5;

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getTomorrowMidnight(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export const checkAndUpdateChatLimit = async (userId: string): Promise<ChatLimitStatus> => {
  if (!userId) throw new Error("User ID is required to check chat limit.");
  
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error("User document not found.");
    }
    
    const userData = userDoc.data() as UserDocument;
    const today = getTodayDateString();
    
    // Initialize defaults for existing users without these fields
    const subscriptionType = userData.subscriptionType || 'free';
    let chatUsage = userData.chatUsage || { count: 0, lastCheckedDate: today };
    
    // If user doesn't have subscription fields, add them
    if (!userData.subscriptionType || !userData.chatUsage) {
      await updateDoc(userDocRef, {
        subscriptionType: 'free',
        chatUsage: { count: 0, lastCheckedDate: today }
      });
    }
    
    // Premium users have unlimited access
    if (subscriptionType === 'premium') {
      return {
        canSendMessage: true,
        remaining: Infinity,
        total: Infinity,
        isPremium: true,
        resetsAt: getTomorrowMidnight(),
      };
    }
    
    // Check if it's a new day - auto reset if yes
    if (chatUsage.lastCheckedDate !== today) {
      chatUsage = { count: 0, lastCheckedDate: today };
      await updateDoc(userDocRef, { chatUsage });
    }
    
    // Check free tier limit
    const canSendMessage = chatUsage.count < FREE_TIER_DAILY_LIMIT;
    const remaining = Math.max(0, FREE_TIER_DAILY_LIMIT - chatUsage.count);
    
    return {
      canSendMessage,
      remaining,
      total: FREE_TIER_DAILY_LIMIT,
      isPremium: false,
      resetsAt: getTomorrowMidnight(),
    };
  } catch (error) {
    console.error('Error checking chat limit:', error);
    throw error;
  }
};

export const incrementChatCount = async (userId: string): Promise<void> => {
  if (!userId) throw new Error("User ID is required to increment chat count.");
  
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error("User document not found.");
    }
    
    const userData = userDoc.data() as UserDocument;
    const today = getTodayDateString();
    
    // Skip increment for premium users
    if (userData.subscriptionType === 'premium') {
      return;
    }
    
    const chatUsage = userData.chatUsage || { count: 0, lastCheckedDate: today };
    
    // Ensure we're incrementing for the correct day
    if (chatUsage.lastCheckedDate !== today) {
      await updateDoc(userDocRef, {
        chatUsage: { count: 1, lastCheckedDate: today }
      });
    } else {
      await updateDoc(userDocRef, {
        chatUsage: { count: chatUsage.count + 1, lastCheckedDate: today }
      });
    }
  } catch (error) {
    console.error('Error incrementing chat count:', error);
    throw error;
  }
};

export { auth, db };