import React from 'react'
import { ArrowRight } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl mb-4 animate-float">
          Image Upscaler Online for free via AI
        </h1>
        <p className="mt-3 max-w-md mx-auto text-xl text-purple-100 sm:text-2xl md:mt-5 md:max-w-3xl">
          It's free! Upscale and enlarge images & photos with 1-click. Enhance and download in seconds.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="#upload"
            className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-purple-700 bg-white hover:bg-purple-50 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Hero