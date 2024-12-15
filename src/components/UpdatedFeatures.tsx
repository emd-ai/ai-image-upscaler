import React from 'react'
import { Zap, Image, Lock, Edit, DollarSign, Maximize } from 'lucide-react'

const UpdatedFeatures: React.FC = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: 'Lightning Fast',
      description: 'Upscale your images in seconds with our advanced AI technology.',
    },
    {
      icon: <Image className="h-8 w-8 text-green-400" />,
      title: 'High Quality',
      description: 'Get crystal clear, high-resolution images without losing detail.',
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-400" />,
      title: 'Secure',
      description: 'Your images are processed securely and never stored on our servers.',
    },
    {
      icon: <Edit className="h-8 w-8 text-purple-400" />,
      title: 'Easy Editing',
      description: 'Fine-tune your upscaled images with our built-in editor.',
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-400" />,
      title: 'Free to Use',
      description: 'Enjoy our basic features at no cost, with affordable premium options.',
    },
    {
      icon: <Maximize className="h-8 w-8 text-red-400" />,
      title: 'Multiple Formats',
      description: 'Support for various image formats including JPG, PNG, and WebP.',
    },
  ];

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="section-heading">Discover the Best Image Upscaler Online for Crystal Clear Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              {feature.icon}
              <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
            </div>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default UpdatedFeatures