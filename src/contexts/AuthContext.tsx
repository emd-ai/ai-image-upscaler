import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  increment,
  Timestamp 
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface UserTierData {
  tier: 'free' | 'premium' | 'enterprise';
  dailyGenerationsLeft: number;
  dailyUpscalesLeft: number;
  totalGenerations: number;
  totalUpscales: number;
  lastResetDate: Timestamp;
  favorites: string[];
  generationHistory: {
    prompt: string;
    images: string[];
    timestamp: Timestamp;
    quality: string;
  }[];
  subscriptionEnds?: Timestamp;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  userTier: UserTierData | null;
  loading: boolean;
  error: string | null;
  resetDailyLimits: () => Promise<void>;
  updateGenerationCount: () => Promise<void>;
  updateUpscaleCount: () => Promise<void>;
  addToFavorites: (imageUrl: string) => Promise<void>;
  removeFromFavorites: (imageUrl: string) => Promise<void>;
  addToHistory: (prompt: string, images: string[], quality: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const [userTier, setUserTier] = useState<UserTierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      const userDoc = doc(db, 'users', user.sub);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        // Create new user data
        const newUserData: UserTierData = {
          tier: 'free',
          dailyGenerationsLeft: 2,
          dailyUpscalesLeft: 1,
          totalGenerations: 0,
          totalUpscales: 0,
          lastResetDate: Timestamp.now(),
          favorites: [],
          generationHistory: []
        };
        await setDoc(userDoc, newUserData);
        setUserTier(newUserData);
      } else {
        const userData = userSnapshot.data() as UserTierData;
        
        // Check if daily limits need to be reset
        const lastReset = userData.lastResetDate.toDate();
        const now = new Date();
        if (lastReset.getDate() !== now.getDate()) {
          await resetDailyLimits();
        } else {
          setUserTier(userData);
        }
      }
    } catch (err) {
      setError('Error loading user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetDailyLimits = async () => {
    if (!user) return;

    const limits = {
      free: { generations: 2, upscales: 1 },
      premium: { generations: 20, upscales: 10 },
      enterprise: { generations: 100, upscales: 50 }
    };

    try {
      const userDoc = doc(db, 'users', user.sub);
      const userData = userTier || (await getDoc(userDoc)).data() as UserTierData;
      const tierLimits = limits[userData.tier];

      await updateDoc(userDoc, {
        dailyGenerationsLeft: tierLimits.generations,
        dailyUpscalesLeft: tierLimits.upscales,
        lastResetDate: Timestamp.now()
      });

      setUserTier(prev => prev ? {
        ...prev,
        dailyGenerationsLeft: tierLimits.generations,
        dailyUpscalesLeft: tierLimits.upscales,
        lastResetDate: Timestamp.now()
      } : null);
    } catch (err) {
      setError('Error resetting daily limits');
      console.error(err);
    }
  };

  const updateGenerationCount = async () => {
    if (!user || !userTier) return;

    try {
      const userDoc = doc(db, 'users', user.sub);
      await updateDoc(userDoc, {
        dailyGenerationsLeft: increment(-1),
        totalGenerations: increment(1)
      });

      setUserTier(prev => prev ? {
        ...prev,
        dailyGenerationsLeft: prev.dailyGenerationsLeft - 1,
        totalGenerations: prev.totalGenerations + 1
      } : null);
    } catch (err) {
      setError('Error updating generation count');
      console.error(err);
    }
  };

  const updateUpscaleCount = async () => {
    if (!user || !userTier) return;

    try {
      const userDoc = doc(db, 'users', user.sub);
      await updateDoc(userDoc, {
        dailyUpscalesLeft: increment(-1),
        totalUpscales: increment(1)
      });

      setUserTier(prev => prev ? {
        ...prev,
        dailyUpscalesLeft: prev.dailyUpscalesLeft - 1,
        totalUpscales: prev.totalUpscales + 1
      } : null);
    } catch (err) {
      setError('Error updating upscale count');
      console.error(err);
    }
  };

  const addToFavorites = async (imageUrl: string) => {
    if (!user || !userTier) return;

    try {
      const userDoc = doc(db, 'users', user.sub);
      await updateDoc(userDoc, {
        favorites: [...userTier.favorites, imageUrl]
      });

      setUserTier(prev => prev ? {
        ...prev,
        favorites: [...prev.favorites, imageUrl]
      } : null);
    } catch (err) {
      setError('Error adding to favorites');
      console.error(err);
    }
  };

  const removeFromFavorites = async (imageUrl: string) => {
    if (!user || !userTier) return;

    try {
      const userDoc = doc(db, 'users', user.sub);
      const updatedFavorites = userTier.favorites.filter(url => url !== imageUrl);
      await updateDoc(userDoc, {
        favorites: updatedFavorites
      });

      setUserTier(prev => prev ? {
        ...prev,
        favorites: updatedFavorites
      } : null);
    } catch (err) {
      setError('Error removing from favorites');
      console.error(err);
    }
  };

  const addToHistory = async (prompt: string, images: string[], quality: string) => {
    if (!user || !userTier) return;

    try {
      const userDoc = doc(db, 'users', user.sub);
      const newHistory = {
        prompt,
        images,
        quality,
        timestamp: Timestamp.now()
      };

      await updateDoc(userDoc, {
        generationHistory: [...userTier.generationHistory, newHistory]
      });

      setUserTier(prev => prev ? {
        ...prev,
        generationHistory: [...prev.generationHistory, newHistory]
      } : null);
    } catch (err) {
      setError('Error adding to history');
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userTier,
        loading: loading || isLoading,
        error,
        resetDailyLimits,
        updateGenerationCount,
        updateUpscaleCount,
        addToFavorites,
        removeFromFavorites,
        addToHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AppAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Auth0Provider
      domain={process.env.VITE_AUTH0_DOMAIN || ''}
      clientId={process.env.VITE_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </Auth0Provider>
  );
};
