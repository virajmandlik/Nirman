import RegisterForm from '@/components/auth/RegisterForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar 
        currentSlide={1} 
        totalSlides={1}
        onSlideChange={() => {}}
        title="Create an Account"
      />
      
      <main className="flex-grow container mx-auto flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register; 