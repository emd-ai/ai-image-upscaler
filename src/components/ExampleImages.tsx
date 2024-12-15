import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { triggerConfetti } from '../utils/confetti'

const ExampleImages: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    // ... (handleSubmit function remains the same)
  }

  const exampleImages = [
    // ... (exampleImages array remains the same)
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-extrabold text-white text-center mb-8">
        No image on hand? Generate Amazing Images with AI
      </h2>
      <div className="glassmorphism p-6 rounded-lg mb-8">
        {/* ... (form and generated image display remain the same) */}
      </div>
      <h3 className="text-2xl font-bold text-white text-center mb-4">Or try one of these examples:</h3>
      <div className="grid grid-cols-5 gap-4">
        {/* ... (example images grid remains the same) */}
      </div>
    </section>
  )
}

export default ExampleImages