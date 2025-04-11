
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Nirman</h3>
            <p className="text-gray-400 text-sm">Revolutionizing Digital Learning</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/username/nirman-learning-platform" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com/in/username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="mailto:nirman-support@example.com" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Nirman Learning Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
