// API Base URLs
const NODE_API_URL = 'http://localhost:5000/api';
const FLASK_API_URL = 'http://localhost:5001';

// Node.js Backend API Endpoints

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await fetch(`${NODE_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  return await response.json();
};

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${NODE_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });
  
  return await response.json();
};

export const completeRegistration = async (data: any) => {
  const response = await fetch(`${NODE_API_URL}/auth/complete-registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
};

// Course endpoints
export const getCourses = async (token: string) => {
  const response = await fetch(`${NODE_API_URL}/users/courses`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

export const getCourseContent = async (token: string, courseId: string) => {
  const response = await fetch(`${NODE_API_URL}/users/course/${courseId}/content`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

export const updateCourseProgress = async (token: string, courseId: string, data: any) => {
  const response = await fetch(`${NODE_API_URL}/users/course/${courseId}/progress`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
};

export const getCertificates = async (token: string) => {
  const response = await fetch(`${NODE_API_URL}/users/certificates`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Flask API Endpoints (Content Recommendations)
export const getVideoRecommendations = async (query: string) => {
  try {
    console.log(`Fetching video recommendations for query: ${query} from ${FLASK_API_URL}/videos`);
    const response = await fetch(`${FLASK_API_URL}/videos?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Video API response:', data);
    
    // Ensure data is in the correct format
    if (!data.items && Array.isArray(data)) {
      // Convert array format to YouTube API format
      return { items: data.map((item: any, index: number) => ({
        id: { videoId: item.id || `video-${index}` },
        snippet: {
          title: item.title || 'Untitled Video',
          description: item.description || 'No description available',
          thumbnails: { 
            default: { url: item.thumbnail || 'https://via.placeholder.com/120x90' }
          }
        }
      }))};
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching video recommendations:', error);
    // Return empty items array on error
    return { items: [] };
  }
};

export const getBookRecommendations = async (query: string) => {
  try {
    console.log(`Fetching book recommendations for query: ${query} from ${FLASK_API_URL}/books`);
    const response = await fetch(`${FLASK_API_URL}/books?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Book API response:', data);
    
    // Ensure data is in the correct format
    if (!Array.isArray(data)) {
      console.error('Books API returned unexpected format:', data);
      return [];
    }
    
    // Normalize book data
    return data.map((book: any) => ({
      title: book.title || 'Untitled Book',
      description: book.description || 'No description available',
      url: book.url || '#'
    }));
  } catch (error) {
    console.error('Error fetching book recommendations:', error);
    // Return empty array on error
    return [];
  }
};

// Helper to get recommendations for a course based on keywords
export const getRecommendationsForCourse = async (keywords: string[]) => {
  const query = keywords.join(',');
  console.log(`Getting recommendations for keywords: ${query}`);
  
  try {
    const [videosResponse, booksResponse] = await Promise.all([
      getVideoRecommendations(query),
      getBookRecommendations(query)
    ]);
    
    console.log('Combined recommendations:', {
      videos: videosResponse,
      books: booksResponse
    });
    
    return {
      videos: videosResponse,
      books: booksResponse
    };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return {
      videos: { items: [] },
      books: []
    };
  }
}; 