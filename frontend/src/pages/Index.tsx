
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TitleSlide from '@/components/slides/TitleSlide';
import ProblemStatementSlide from '@/components/slides/ProblemStatementSlide';
import TechStackSlide from '@/components/slides/TechStackSlide';
import InspirationSlide from '@/components/slides/InspirationSlide';
import InnovationSlide from '@/components/slides/InnovationSlide';
import KeyFeaturesSlide from '@/components/slides/KeyFeaturesSlide';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  
  const slides = [
    { id: 1, component: <TitleSlide />, title: "Nirman" },
    { id: 2, component: <ProblemStatementSlide />, title: "Problem Statement & Key Challenges" },
    { id: 3, component: <KeyFeaturesSlide />, title: "Key Features & Innovations" },
    { id: 4, component: <TechStackSlide />, title: "Technology Stack Overview" },
    { id: 5, component: <InspirationSlide />, title: "Inspiration Behind Our Solution" },
    { id: 6, component: <InnovationSlide />, title: "Innovation & Creativity" },
  ];
  
  const handleSlideChange = (slideNumber: number) => {
    setCurrentSlide(slideNumber);
    // Scroll to top when changing slides
    window.scrollTo(0, 0);
  };
  
  const currentSlideData = slides.find(slide => slide.id === currentSlide) || slides[0];

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar 
        currentSlide={currentSlide} 
        totalSlides={slides.length}
        onSlideChange={handleSlideChange}
        title={currentSlideData.title}
      />
      
      <main className="flex-grow mt-16">
        {currentSlideData.component}
        
        <div className="container mx-auto py-12 px-4">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Explore Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/personalized">
              <Button variant="outline" className="w-full h-16 text-lg font-medium bg-indigo-600/20 hover:bg-indigo-600/40 border-indigo-500 text-white">
                Personalized Content Dashboard
              </Button>
            </Link>
            <Link to="/gamified">
              <Button variant="outline" className="w-full h-16 text-lg font-medium bg-green-600/20 hover:bg-green-600/40 border-green-500 text-white">
                Gamified Learning Experience
              </Button>
            </Link>
            <Link to="/coding">
              <Button variant="outline" className="w-full h-16 text-lg font-medium bg-blue-600/20 hover:bg-blue-600/40 border-blue-500 text-white">
                Interactive Coding Environment
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="outline" className="w-full h-16 text-lg font-medium bg-purple-600/20 hover:bg-purple-600/40 border-purple-500 text-white">
                Multilingual LLM Assistant
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
