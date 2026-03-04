import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Spinner from '../components/UI/Spinner';
import Alert from '../components/UI/Alert';
import Button from '../components/UI/Button';
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
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to LMS</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Getting Started
        </h2>
        <p className="text-blue-700 mb-4">
          Select a subject below to start learning. Your progress will be tracked automatically.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {!loading && !error && subjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No subjects available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/subjects/${subject.id}`)}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {subject.name}
              </h2>
              {subject.description && (
                <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
              )}
              <Button variant="primary" size="sm">
                View Subject
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
