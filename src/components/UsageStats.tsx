import React from 'react';
import { useAuth } from '../contexts/LocalAuthContext';
import { BarChart, Clock, Zap } from 'lucide-react';

const UsageStats: React.FC = () => {
  const { 
    user,
    getRemainingUpscales,
    getTimeUntilNextReset,
  } = useAuth();

  const remainingUpscales = getRemainingUpscales();
  const msUntilReset = getTimeUntilNextReset();
  
  const formatTimeUntilReset = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!user) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Usage Statistics</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.isPremium ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'bg-blue-500/20 text-blue-300'
        }`}>
          {user.isPremium ? 'Premium' : 'Free Tier'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Remaining Upscales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Remaining Today</span>
          </div>
          <span className="text-white font-medium">{remainingUpscales} upscales</span>
        </div>

        {/* Time until reset */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Resets in</span>
          </div>
          <span className="text-white font-medium">{formatTimeUntilReset(msUntilReset)}</span>
        </div>

        {/* Usage Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Usage</span>
            <span>{user.upscaleCount} / {user.isPremium ? '50' : '3'}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                user.isPremium ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-blue-500'
              }`}
              style={{ 
                width: `${(user.upscaleCount / (user.isPremium ? 50 : 3)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Premium Upgrade Button (show only for free tier) */}
        {!user.isPremium && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openUpgradeModal'))}
            className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 
                     text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );
};

export default UsageStats;
