import React from 'react'
import { Image } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 bg-opacity-80 shadow-md">
      <nav className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-purple-500" />
            <span className="ml-2 text-xl font-bold text-white">AI Image Upscaler</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="bg-yellow-400 text-black font-bold px-4 py-2 rounded hover:bg-yellow-500 transition-colors">Login</a>
            <a href="#" className="bg-yellow-400 text-black font-bold px-4 py-2 rounded hover:bg-yellow-500 transition-colors">Signup</a>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header