import { useLocation, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LearningPathSelectionForm from '@/components/auth/LearningPathSelection';

const LearningPathSelectionPage = () => {
  const location = useLocation();
  const userData = location.state?.userData;

  // If no userData is provided, redirect to registration page
  if (!userData) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar 
        currentSlide={2} 
        totalSlides={2}
        onSlideChange={() => {}}
        title="Choose Your Learning Path"
      />
      
      <main className="flex-grow container mx-auto flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <LearningPathSelectionForm userData={userData} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LearningPathSelectionPage; 