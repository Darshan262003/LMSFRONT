import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Spinner from '../components/UI/Spinner';
import Alert from '../components/UI/Alert';
import Navbar from '../components/UI/Navbar';
import CourseGrid from '../components/UI/CourseGrid';
import { authStore } from '../stores/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = authStore();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        // Add cache control to prevent stale data
        const response = await apiClient.get('/api/subjects', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        // Backend returns: { success: true, data: [...], pagination: {...} }
        // Extract the actual subjects array from response.data.data
        const subjectsArray = response.data?.data || response.data;
        
        // Ensure it's an array before setting
        if (Array.isArray(subjectsArray)) {
          setSubjects(subjectsArray);
          setError(null);
        } else {
          console.error('Expected array but got:', subjectsArray);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        
        // Handle different error types
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
        } else if (err.response?.status === 403) {
          setError('Access denied. Please login.');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Network error. Please check your connection.');
        } else {
          setError('Failed to load subjects. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      <Navbar />
      
      <div className="home-content">
        <div className="page-header">
          <h1 className="page-title">My Courses</h1>
          <p className="page-subtitle">Continue learning where you left off</p>
        </div>

        {loading && (
          <div className="loading-container">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {!loading && !error && subjects.length > 0 && (
          <CourseGrid subjects={subjects} />
        )}

        {!loading && !error && subjects.length === 0 && (
          <div className="no-courses">
            <p className="text-gray-500 text-lg">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
