import React from 'react';
import { useAuth } from '../contexts/LocalAuthContext';
import { Check, Zap, Crown, Sparkles, Image as ImageIcon, Wand2, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingSection: React.FC = () => {
  const { isAuthenticated, userTier } = useAuth();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = {
    free: [
      'Generate 2 images per day',
      'Standard quality generation',
      'Basic image history',
      'Community support'
    ],
    premium: [
      'Generate 20 images per day',
      'High quality generation',
      'Advanced style controls',
      'Priority generation queue',
      'Image variations feature',
      'Advanced prompt assistance',
      'Custom negative prompts',
      'Save favorite generations',
      'Download in multiple formats',
      '24/7 Premium support'
    ]
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,199,0,0.1),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,199,0,0.05),_transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          className="text-center mb-16"
          {...fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-yellow-500 text-transparent bg-clip-text">
            Choose Your Creative Journey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the plan that best fits your creative needs. Upgrade anytime to unlock premium features and enhanced generation capabilities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <motion.div
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Free</h3>
                  <p className="text-gray-400">Perfect for getting started</p>
                </div>
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 ml-2">/ month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 px-6 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
                onClick={() => window.location.href = '/signup'}
              >
                Get Started
              </button>
            </div>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            className="relative bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-yellow-500/20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="absolute top-0 right-0 bg-yellow-500 text-black px-4 py-1 text-sm font-medium rounded-bl-lg">
              Most Popular
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Premium</h3>
                  <p className="text-yellow-400">Unleash your creativity</p>
                </div>
                <Crown className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-gray-400 ml-2">/ month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200"
                onClick={() => window.location.href = '/upgrade'}
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">High Quality</h3>
            <p className="text-gray-400">Generate stunning high-resolution images with premium quality</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
              <Wand2 className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Style Control</h3>
            <p className="text-gray-400">Fine-tune your generations with advanced style controls</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Fast Generation</h3>
            <p className="text-gray-400">Priority queue for faster image generation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
              <Scale className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">More Options</h3>
            <p className="text-gray-400">Generate more images with higher daily limits</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
