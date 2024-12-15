import React, { useState } from 'react';
import { Loader } from 'lucide-react';

interface ImageGenerationSectionProps {
  onImagesGenerated?: (urls: string[]) => void;
}

const ImageGenerationSection: React.FC<ImageGenerationSectionProps> = ({ onImagesGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, num_outputs: 4 }),
      });

      if (!response.ok) throw new Error('Failed to generate images');

      const { images } = await response.json();
      onImagesGenerated?.(images);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate images');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="generate" className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="section-heading">Didn't Quite Find the Perfect Image? Use Our AI Model to Generate One</h2>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
            Enter your prompt
          </label>
          <div className="mt-1">
            <textarea
              id="prompt"
              name="prompt"
              rows={3}
              className="shadow-sm block w-full sm:text-sm border border-gray-700 bg-gray-800 rounded-md p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isLoading || !prompt.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              'Generate Images'
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ImageGenerationSection;
