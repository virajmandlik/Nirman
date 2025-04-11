import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LearningPathSelectionProps {
  userData: {
    name: string;
    email: string;
    password: string;
  };
}

const LearningPathSelection = ({ userData }: LearningPathSelectionProps) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { completeRegistration } = useAuth();

  const learningPaths = [
    {
      id: 'webDev',
      title: 'Web Development',
      description: 'Learn HTML, CSS, JavaScript, and modern frameworks to build interactive websites',
      icon: '🌐'
    },
    {
      id: 'programming',
      title: 'Programming',
      description: 'Master programming fundamentals, algorithms, and software development practices',
      icon: '💻'
    },
    {
      id: 'aiml',
      title: 'AI & Machine Learning',
      description: 'Explore artificial intelligence, machine learning models, and data analysis',
      icon: '🤖'
    },
    {
      id: 'dataScience',
      title: 'Data Science',
      description: 'Learn to analyze, visualize, and derive insights from complex datasets',
      icon: '📊'
    }
  ];

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(pathId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPath) {
      toast({
        title: 'Error',
        description: 'Please select a learning path to continue',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Complete registration with learning path
      await completeRegistration({
        ...userData,
        learningPath: selectedPath
      });
      
      toast({
        title: 'Registration Complete',
        description: 'Your account has been created successfully!',
      });
      
      // Navigate to dashboard
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to complete registration',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your Learning Path</CardTitle>
        <CardDescription>Select the learning path that best fits your interests and goals</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPaths.map((path) => (
              <div 
                key={path.id}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all
                  ${selectedPath === path.id 
                    ? 'border-primary bg-primary/10 shadow-md' 
                    : 'border-border hover:border-primary/50'}
                `}
                onClick={() => handlePathSelect(path.id)}
              >
                <div className="text-3xl mb-2">{path.icon}</div>
                <h3 className="font-medium text-lg">{path.title}</h3>
                <p className="text-sm text-muted-foreground">{path.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !selectedPath}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Completing registration...
              </>
            ) : (
              'Complete Registration'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LearningPathSelection; 