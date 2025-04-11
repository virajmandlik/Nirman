import LoginForm from '@/components/auth/LoginForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar 
        currentSlide={1} 
        totalSlides={1}
        onSlideChange={() => {}}
        title="Login to Nirman"
      />
      
      <main className="flex-grow container mx-auto flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login; 