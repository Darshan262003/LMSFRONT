import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { authStore } from '../stores/authStore';
import AppLayout from '../components/Layout/AppLayout';
import Spinner from '../components/UI/Spinner';
import Alert from '../components/UI/Alert';
import Button from '../components/UI/Button';

interface Stats {
  videosCompleted: number;
  totalWatchTimeMinutes: number;
  subjectsEnrolled: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = authStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call when backend is available
        // const response = await apiClient.get('/profile/stats');
        // setStats(response.data);
          
        // Mock stats for demonstration (remove when backend is connected)
        setStats({
          videosCompleted: 5,
          totalWatchTimeMinutes: 127,
          subjectsEnrolled: 3,
        });
        setError(null);
      } catch (err) {
        setError('Failed to load profile statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
      
    fetchProfileStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg text-gray-800">{user?.name || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-800">{user?.email || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Progress</h2>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          {!loading && !error && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-blue-600 mb-2">
                  Videos Completed
                </h3>
                <p className="text-3xl font-bold text-blue-800">
                  {stats.videosCompleted}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-green-600 mb-2">
                  Total Watch Time
                </h3>
                <p className="text-3xl font-bold text-green-800">
                  {stats.totalWatchTimeMinutes} min
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-purple-600 mb-2">
                  Subjects Enrolled
                </h3>
                <p className="text-3xl font-bold text-purple-800">
                  {stats.subjectsEnrolled}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && !stats && (
            <p className="text-gray-500 text-center py-12">
              No statistics available yet. Start learning to see your progress!
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
