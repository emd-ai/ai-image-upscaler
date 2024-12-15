import React from 'react';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const placeholderImages = [
    'https://source.unsplash.com/random/800x600?ai',
    'https://source.unsplash.com/random/800x600?technology',
    'https://source.unsplash.com/random/800x600?future',
    'https://source.unsplash.com/random/800x600?digital',
    'https://source.unsplash.com/random/800x600?innovation',
    'https://source.unsplash.com/random/800x600?machine',
    'https://source.unsplash.com/random/800x600?robot',
    'https://source.unsplash.com/random/800x600?computer'
  ];

  const displayImages = [...images, ...placeholderImages].slice(0, 8);

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="section-heading">
        From Concept to Creation – Stunning AI-Generated Images
      </h2>
      <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
        Explore our collection of high-quality 4K images and wallpapers, generated using advanced AI technology. Our upscaling model enhances details, removes noise, and fixes artifacts, ensuring each image is crystal clear with intricate details. With the ability to upscale from 64px to a maximum of 13,000px, you'll get the finest AI-upscaled masterpieces in stunning resolution.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayImages.map((src, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src={src} 
              alt={`${index < images.length ? 'Generated' : 'Placeholder'} image ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;