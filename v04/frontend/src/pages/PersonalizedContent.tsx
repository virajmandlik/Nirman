import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, LineChart, BookOpen, Sparkles, CheckCircle, Play, Book, Award, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { getCourses, getCourseContent, updateCourseProgress, getCertificates, getRecommendationsForCourse } from '@/lib/api';

interface Course {
  id: string;
  name: string;
  keywords: string[];
  completed: boolean;
  progress: number;
}

interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
    };
  };
}

interface Book {
  title: string;
  description: string;
  url: string;
}

interface CourseContent {
  videos: {
    items: Video[];
  };
  books: Book[];
}

const PersonalizedContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Fetch user's courses
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        
        // Fetch courses and certificates in parallel
        const [coursesData, certificatesData] = await Promise.all([
          getCourses(token),
          getCertificates(token)
        ]);
        
        if (coursesData.success) {
          setCourses(coursesData.courses);
          setOverallProgress(coursesData.overallProgress);
        } else {
          throw new Error(coursesData.message || 'Failed to fetch courses');
        }
        
        if (certificatesData.success) {
          setCertificates(certificatesData.certificates || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch your courses',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);

  // Fetch course content when a course is selected
  useEffect(() => {
    if (!selectedCourse) return;
    
    const fetchCourseContent = async () => {
      setContentLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        console.log(`Fetching content for course: ${selectedCourse.id} with keywords: ${selectedCourse.keywords.join(',')}`);
        
        // Try to get course content from the backend
        const data = await getCourseContent(token, selectedCourse.id);
        console.log('Backend API response:', data);
        
        if (data.success && data.content) {
          // Validate the structure of the response
          if (!data.content.videos || !data.content.books) {
            console.error('Invalid content structure received:', data.content);
            throw new Error('Invalid content structure received from server');
          }
          
          // Ensure videos has items property (YouTube API format)
          if (!data.content.videos.items) {
            console.log('Converting video data to expected format');
            data.content.videos = { items: data.content.videos };
          }
          
          console.log('Setting course content:', data.content);
          setCourseContent(data.content);
        } else {
          console.log('Backend API failed, falling back to Flask API');
          // If backend fails, try to get recommendations directly from Flask API
          const recommendationsData = await getRecommendationsForCourse(selectedCourse.keywords);
          console.log('Flask API response:', recommendationsData);
          
          // Ensure data is in the correct format
          const formattedData = {
            videos: recommendationsData.videos.items ? 
              recommendationsData.videos : 
              { items: recommendationsData.videos },
            books: recommendationsData.books
          };
          
          console.log('Setting formatted content:', formattedData);
          setCourseContent(formattedData);
        }
      } catch (error) {
        console.error('Error fetching course content:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch course content. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setContentLoading(false);
      }
    };
    
    fetchCourseContent();
  }, [selectedCourse, toast]);

  // Mark course as completed
  const markCourseAsCompleted = async (courseId: string) => {
    try {
      console.log(`Marking course as completed: ${courseId}`);
      const token = localStorage.getItem('token') || '';
      
      // Log the request being sent
      console.log('Sending update request with data:', {
        completed: true,
        progress: 100
      });
      
      const data = await updateCourseProgress(token, courseId, {
        completed: true,
        progress: 100
      });
      
      console.log('Update course progress response:', data);
      
      if (data.success) {
        // Update the courses list with the new progress
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === courseId 
              ? { 
                  ...course, 
                  completed: data.completed, 
                  progress: data.progress 
                } 
              : course
          )
        );
        
        // Update selected course if it's the current one
        if (selectedCourse?.id === courseId) {
          setSelectedCourse(prev => 
            prev ? { 
              ...prev, 
              completed: data.completed, 
              progress: data.progress 
            } : null
          );
        }
        
        // Update overall progress
        setOverallProgress(data.overallProgress);
        
        // Check if certificate is issued
        if (data.certificate) {
          setCertificates(prev => [...prev, data.certificate]);
          toast({
            title: 'Congratulations!',
            description: 'You have earned a certificate for completing all courses in this learning path!',
          });
        }
        
        // Refresh the courses data to ensure we have the latest state
        const coursesData = await getCourses(token);
        if (coursesData.success) {
          console.log('Refreshed courses data:', coursesData);
          setCourses(coursesData.courses);
          setOverallProgress(coursesData.overallProgress);
        }
        
        toast({
          title: 'Success',
          description: `Course marked as completed. Progress: ${data.progress}%, Overall Progress: ${data.overallProgress}%`,
        });
      } else {
        console.error('Failed to update course progress:', data.message);
        throw new Error(data.message || 'Failed to update course progress');
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to mark course as completed',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
      <Navbar
        currentSlide={1}
        totalSlides={4}
        onSlideChange={() => {}}
        title="Personalized Learning Experience"
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Learning Journey</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Track your progress and access personalized learning resources
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 border-indigo-300/20 text-white backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-medium">
                      {user?.preferences?.learningPath === 'webDev' && 'Web Development'}
                      {user?.preferences?.learningPath === 'programming' && 'Programming Fundamentals'}
                      {user?.preferences?.learningPath === 'aiml' && 'AI & Machine Learning'}
                      {user?.preferences?.learningPath === 'dataScience' && 'Data Science'}
                    </CardTitle>
                    <CardDescription className="text-indigo-200">
                      Your selected learning path
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{overallProgress}%</div>
                    <div className="text-indigo-200 text-sm">Overall Progress</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={overallProgress} 
                  className="h-3 mb-6" 
                  indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500" 
                />
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300"></div>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                      <div 
                        key={course.id} 
                        className={`p-4 rounded-lg border cursor-pointer transition-all relative 
                          ${selectedCourse?.id === course.id 
                            ? 'bg-indigo-600/40 border-indigo-400' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        onClick={() => setSelectedCourse(course)}
                      >
                        {course.completed && (
                          <Badge className="absolute top-2 right-2 bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" /> Completed
                          </Badge>
                        )}
                        
                        <h3 className="font-medium text-lg mb-2">{course.name}</h3>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {course.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-indigo-500/20">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-indigo-200">Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        
                        <Progress 
                          value={course.progress} 
                          className="h-2" 
                          indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500" 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-indigo-200">
                    <p>No courses found. Please select a learning path in your profile.</p>
                  </div>
                )}
                
                {certificates.length > 0 && (
                  <div className="mt-8 p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-400/30">
                    <div className="flex items-center mb-3">
                      <Award className="h-6 w-6 text-yellow-400 mr-2" />
                      <h3 className="text-lg font-medium text-yellow-300">Your Certificates</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.map((cert, idx) => (
                        <div key={idx} className="p-3 bg-white/10 rounded border border-white/20 flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {cert.learningPath === 'webDevCourses' && 'Web Development Certificate'}
                              {cert.learningPath === 'programmingCourses' && 'Programming Certificate'}
                              {cert.learningPath === 'aimlCourses' && 'AI & ML Certificate'}
                              {cert.learningPath === 'dataScienceCourses' && 'Data Science Certificate'}
                            </div>
                            <div className="text-xs text-indigo-200">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" /> Share
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-white/10 border-indigo-300/20 text-white backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-medium">
                      Course: {selectedCourse.name}
                    </CardTitle>
                    <CardDescription className="text-indigo-200">
                      {selectedCourse.keywords.join(', ')}
                    </CardDescription>
                  </div>
                  {!selectedCourse.completed && (
                    <Button onClick={() => markCourseAsCompleted(selectedCourse.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {contentLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-300"></div>
                  </div>
                ) : courseContent ? (
                  <Tabs defaultValue="videos">
                    <TabsList className="bg-indigo-800/50 border border-indigo-700">
                      <TabsTrigger value="videos" className="data-[state=active]:bg-indigo-700">
                        <Play className="h-4 w-4 mr-2" /> Videos
                      </TabsTrigger>
                      <TabsTrigger value="books" className="data-[state=active]:bg-indigo-700">
                        <Book className="h-4 w-4 mr-2" /> Books & Documentation
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="videos" className="mt-4">
                      {courseContent.videos?.items?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {courseContent.videos.items.slice(0, 4).map((video, idx) => {
                            // Handle different video data formats
                            const videoId = video.id?.videoId || video.videoId || `fallback-${idx}`;
                            const title = video.snippet?.title || video.title || 'Video title not available';
                            const description = video.snippet?.description || video.description || 'No description available';
                            let thumbnailUrl = '';
                            
                            // Handle different thumbnail formats
                            if (video.snippet?.thumbnails?.default?.url) {
                              thumbnailUrl = video.snippet.thumbnails.default.url.replace('default.jpg', 'mqdefault.jpg');
                            } else if (video.thumbnail) {
                              thumbnailUrl = video.thumbnail;
                            } else {
                              thumbnailUrl = `https://via.placeholder.com/320x180?text=Video+${idx + 1}`;
                            }

                            return (
                              <a 
                                key={`${videoId}-${idx}`}
                                href={`https://www.youtube.com/watch?v=${videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                              >
                                <div className="aspect-video mb-3 bg-black/30 rounded overflow-hidden">
                                  <img 
                                    src={thumbnailUrl} 
                                    alt={title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback for image loading error
                                      e.currentTarget.src = `https://via.placeholder.com/320x180?text=Video+${idx + 1}`;
                                    }}
                                  />
                                </div>
                                <h3 className="font-medium mb-2 line-clamp-2">{title}</h3>
                                <p className="text-sm text-indigo-200 line-clamp-2">{description}</p>
                                <div className="flex items-center mt-3 text-xs text-indigo-300">
                                  <ExternalLink className="h-3 w-3 mr-1" /> Watch on YouTube
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-indigo-200">
                          No videos found for this topic. Try selecting a different course.
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="books" className="mt-4">
                      {courseContent.books?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {courseContent.books.slice(0, 3).map((book, idx) => {
                            // Ensure required properties exist
                            const title = book.title || book.name || `Resource ${idx + 1}`;
                            const description = book.description || 'No description available';
                            const url = book.url || '#';
                            
                            return (
                              <a
                                key={`book-${idx}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all h-full flex flex-col"
                              >
                                <h3 className="font-medium mb-2">{title}</h3>
                                <p className="text-sm text-indigo-200 mb-4 flex-grow line-clamp-4">{description}</p>
                                <div className="flex items-center text-xs text-indigo-300">
                                  <BookOpen className="h-3 w-3 mr-1" /> Read More
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-indigo-200">
                          No books or documentation found for this topic. Try selecting a different course.
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-8 text-indigo-200">
                    No content available for this course.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-indigo-200">
                  <Sparkles className="inline h-4 w-4 mr-1 text-indigo-300" /> 
                  Complete this course to earn points and advance your learning path.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-block p-3 bg-indigo-500/20 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Continue your learning journey
          </h3>
          <p className="text-indigo-200 mt-2 max-w-2xl mx-auto">
            Complete all courses to receive your certificate and master your chosen learning path.
          </p>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PersonalizedContent;
