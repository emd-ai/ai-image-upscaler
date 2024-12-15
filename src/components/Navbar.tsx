import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/LocalAuthContext';
import { User, LogOut, Crown, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, userTier, login, logout } = useAuth();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900/90 to-gray-900/50 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Sparkles className="h-6 w-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 text-transparent bg-clip-text">
                ImageGen
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center">
                  <div className="px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center space-x-2">
                    <span className="text-sm text-gray-300">
                      {userTier?.dailyGenerationsLeft} generations left
                    </span>
                    {userTier?.tier === 'premium' && (
                      <Crown className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-gray-800/50 border border-gray-700/50 text-white px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-6 w-6 rounded-full ring-2 ring-gray-700/50"
                    />
                    <span className="hidden md:inline text-sm text-gray-300">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg py-1 invisible group-hover:visible transform scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={login}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 py-2 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 font-medium"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
