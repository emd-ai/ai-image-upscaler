import React from 'react'
import { Zap, Image, Download } from 'lucide-react'

const Features: React.FC = () => {
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
      icon: <Download className="h-8 w-8 text-blue-400" />,
      title: 'Easy Download',
      description: 'Download your upscaled images instantly, no sign-up required.',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Our AI Image Upscaler?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="glassmorphism p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-purple-100">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features