import React from 'react'
import { Image } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-12">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image className="h-8 w-8 text-purple-500" />
            <span className="ml-2 text-xl font-bold text-white">AI Image Upscaler</span>
          </div>
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
          </nav>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2024 AI Image Upscaler. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer