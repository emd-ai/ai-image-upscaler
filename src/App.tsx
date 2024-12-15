import React from 'react';
import { LocalAuthProvider } from './contexts/LocalAuthContext';
import Navbar from './components/Navbar';
import ImageGenerationSection from './components/ImageGenerationSection';
import UserProfile from './components/UserProfile';
import PricingSection from './components/PricingSection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroWithComparison from './components/HeroWithComparison';
import UploadSection from './components/UploadSection';
import ImageGenerationChat from './components/ImageGenerationChat';
import Gallery from './components/Gallery';
import UpdatedFeatures from './components/UpdatedFeatures';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import BackgroundAnimation from './components/BackgroundAnimation';

function App() {
  const [generatedImages, setGeneratedImages] = React.useState<string[]>([]);

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImages(prev => [...prev, imageUrl]);
  };

  return (
    <LocalAuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="relative">
                  <BackgroundAnimation />
                  <div className="relative z-10">
                    <Header />
                    <main>
                      <HeroWithComparison />
                      <UploadSection onImageUpscaled={handleImageGenerated} />
                      <ImageGenerationChat onImageGenerated={handleImageGenerated} />
                      <Gallery images={generatedImages} />
                      <UpdatedFeatures />
                      <FAQ />
                    </main>
                    <Footer />
                  </div>
                </div>
              } />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/pricing" element={<PricingSection />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LocalAuthProvider>
  );
}

export default App;