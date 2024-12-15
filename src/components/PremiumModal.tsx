import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Crown, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useAuth } from '../contexts/LocalAuthContext';

interface PremiumFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: PremiumFeature[] = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: '50 Daily Upscales',
    description: 'Process up to 50 images every day'
  },
  {
    icon: <Crown className="w-6 h-6 text-yellow-400" />,
    title: 'Priority Processing',
    description: 'Skip the queue and get faster results'
  },
  {
    icon: <ImageIcon className="w-6 h-6 text-yellow-400" />,
    title: 'Higher Resolution',
    description: 'Upscale images up to 8K resolution'
  },
  {
    icon: <Wand2 className="w-6 h-6 text-yellow-400" />,
    title: 'Advanced Features',
    description: 'Access to face enhancement and custom settings'
  }
];

const PremiumModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openUpgradeModal', handleOpen);
    return () => window.removeEventListener('openUpgradeModal', handleOpen);
  }, []);

  if (!isOpen || user?.isPremium) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-6 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to Premium
          </h2>
          <p className="text-gray-400">
            Unlock advanced features and higher limits
          </p>
        </div>

        {/* Features */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800/50"
            >
              {feature.icon}
              <div>
                <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <span className="text-3xl font-bold text-white">$9.99</span>
              <span className="text-gray-400">/month</span>
            </div>
            <button
              onClick={() => {
                // Implement payment logic here
                console.log('Upgrade to premium clicked');
              }}
              className="w-full max-w-md px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 
                       text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Upgrade Now
            </button>
            <p className="mt-4 text-sm text-gray-400">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
