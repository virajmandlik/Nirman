
import { useState } from 'react';
import { BookOpen, Code, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  currentSlide: number;
  totalSlides: number;
  onSlideChange: (slide: number) => void;
  title: string;
}

const Navbar = ({ currentSlide, totalSlides, onSlideChange, title }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePrevious = () => {
    if (currentSlide > 1) {
      onSlideChange(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      onSlideChange(currentSlide + 1);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg px-4 py-3 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold hidden md:block">Adaptive Learning Platform</h1>
        </div>

        <h2 className="text-lg font-semibold hidden md:block">{title}</h2>

        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevious}
            disabled={currentSlide === 1}
            className="bg-white/20 hover:bg-white/30 text-white border-white/40"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm font-medium">
            {currentSlide} / {totalSlides}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNext}
            disabled={currentSlide === totalSlides}
            className="bg-white/20 hover:bg-white/30 text-white border-white/40"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/20"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-0 top-14 bg-indigo-900/95 z-40 flex flex-col items-center pt-10 gap-6",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <h2 className="text-xl font-bold text-center px-4">{title}</h2>
        
        <div className="flex flex-wrap justify-center gap-2 px-4 max-w-md">
          {Array.from({ length: totalSlides }, (_, i) => (
            <Button 
              key={i}
              variant={currentSlide === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onSlideChange(i + 1);
                setIsMobileMenuOpen(false);
              }}
              className={currentSlide === i + 1 ? "bg-white text-indigo-700" : "bg-transparent text-white border-white/40"}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => {
              handlePrevious();
              setIsMobileMenuOpen(false);
            }}
            disabled={currentSlide === 1}
            className="bg-white/20 hover:bg-white/30 text-white border-white/40"
          >
            <ChevronLeft className="mr-1 h-5 w-5" /> Previous
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => {
              handleNext();
              setIsMobileMenuOpen(false);
            }}
            disabled={currentSlide === totalSlides}
            className="bg-white/20 hover:bg-white/30 text-white border-white/40"
          >
            Next <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
