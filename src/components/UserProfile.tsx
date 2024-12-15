import React from 'react';
import { useAuth } from '../contexts/LocalAuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Heart, Image as ImageIcon, TrendingUp, Crown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserProfile: React.FC = () => {
  const { user, userTier, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !userTier) {
    return <div>Please log in to view your profile</div>;
  }

  const generationHistory = userTier.generationHistory.slice(-30); // Last 30 generations
  const chartData = {
    labels: generationHistory.map(h => 
      new Date(h.timestamp.seconds * 1000).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Generations',
        data: generationHistory.map(() => 1),
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Generation History (Last 30 Days)'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* User Header */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={user.picture}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <div className="mt-2 flex items-center space-x-2">
              <Crown className="text-yellow-400" size={20} />
              <span className="text-yellow-400 font-medium">
                {userTier.tier.charAt(0).toUpperCase() + userTier.tier.slice(1)} Tier
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ImageIcon className="text-blue-400" size={24} />
            <h2 className="text-lg font-semibold text-white">Generations</h2>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white">{userTier.totalGenerations}</p>
            <p className="text-sm text-gray-400">Total Images Generated</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Today's Remaining</span>
                <span className="text-white">{userTier.dailyGenerationsLeft}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-400 rounded-full h-2"
                  style={{
                    width: `${(userTier.dailyGenerationsLeft / (userTier.tier === 'premium' ? 20 : 2)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="text-green-400" size={24} />
            <h2 className="text-lg font-semibold text-white">Upscales</h2>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white">{userTier.totalUpscales}</p>
            <p className="text-sm text-gray-400">Total Images Upscaled</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Today's Remaining</span>
                <span className="text-white">{userTier.dailyUpscalesLeft}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-400 rounded-full h-2"
                  style={{
                    width: `${(userTier.dailyUpscalesLeft / (userTier.tier === 'premium' ? 10 : 1)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="text-red-400" size={24} />
            <h2 className="text-lg font-semibold text-white">Favorites</h2>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white">{userTier.favorites.length}</p>
            <p className="text-sm text-gray-400">Saved Images</p>
          </div>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <Line options={chartOptions} data={chartData} />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Generations</h2>
        <div className="space-y-4">
          {userTier.generationHistory.slice(-5).reverse().map((generation, index) => (
            <div key={index} className="border-b border-gray-700 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-300">{generation.prompt}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(generation.timestamp.seconds * 1000).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {generation.quality}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {generation.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`Generation ${imgIndex + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
