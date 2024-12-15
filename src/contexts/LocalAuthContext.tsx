import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  isPremium: boolean;
  remainingUpscales: number;
  totalUpscales: number;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  incrementUpscaleCount: () => void;
  resetUpscaleCount: () => void;
  getTimeUntilReset: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a LocalAuthProvider');
  }
  return context;
};

export const LocalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [remainingUpscales, setRemainingUpscales] = useState(3); // Default free tier limit
  const [totalUpscales, setTotalUpscales] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(Date.now());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Reset counts when user signs in/out
      if (user) {
        loadUserData();
      } else {
        resetToDefaults();
      }
    });

    return () => unsubscribe();
  }, []);

  // Check and reset daily limits at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      resetUpscaleCount();
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, [lastResetTime]);

  const loadUserData = async () => {
    if (!user) return;
    
    // Here you can load user data from Firestore if needed
    // For now, we'll just check if they're premium based on a custom claim
    const token = await user.getIdTokenResult();
    setIsPremium(!!token.claims.premium);
    
    // Load upscale counts from localStorage
    const storedCounts = localStorage.getItem(`upscale_counts_${user.uid}`);
    if (storedCounts) {
      const { remaining, total, lastReset } = JSON.parse(storedCounts);
      setRemainingUpscales(remaining);
      setTotalUpscales(total);
      setLastResetTime(lastReset);
    } else {
      resetToDefaults();
    }
  };

  const resetToDefaults = () => {
    setIsPremium(false);
    setRemainingUpscales(3);
    setTotalUpscales(0);
    setLastResetTime(Date.now());
  };

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      resetToDefaults();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const incrementUpscaleCount = () => {
    if (remainingUpscales > 0) {
      setRemainingUpscales(prev => prev - 1);
      setTotalUpscales(prev => prev + 1);
      
      if (user) {
        localStorage.setItem(`upscale_counts_${user.uid}`, JSON.stringify({
          remaining: remainingUpscales - 1,
          total: totalUpscales + 1,
          lastReset: lastResetTime
        }));
      }
    }
  };

  const resetUpscaleCount = () => {
    const limit = isPremium ? 50 : 3;
    setRemainingUpscales(limit);
    setLastResetTime(Date.now());
    
    if (user) {
      localStorage.setItem(`upscale_counts_${user.uid}`, JSON.stringify({
        remaining: limit,
        total: totalUpscales,
        lastReset: Date.now()
      }));
    }
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  };

  const value = {
    user,
    isPremium,
    remainingUpscales,
    totalUpscales,
    signIn,
    signOut,
    incrementUpscaleCount,
    resetUpscaleCount,
    getTimeUntilReset
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
