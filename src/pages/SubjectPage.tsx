import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import SubjectSidebar from '../components/Sidebar/SubjectSidebar';
import apiClient from '../services/apiClient';
import Spinner from '../components/UI/Spinner';
import Alert from '../components/UI/Alert';

interface Video {
  id: string;
  title: string;
  durationSeconds: number;
  orderIndex: number;
  isLocked: boolean;
  isCompleted: boolean;
}

interface Section {
  id: string;
  title: string;
  orderIndex: number;
  videos?: Video[];
  subsections?: Section[];
}

interface SubjectTree {
  id: string;
  title: string;
  description?: string;
  sections?: Section[];
}

const SubjectPage = () => {
  const { subjectId } = useParams();
  const [tree, setTree] = useState<SubjectTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/subjects/${subjectId}/tree`);
        
        // Backend returns: { success: true, data: {...} }
        // Extract the actual tree data from response.data.data
        const treeData = response.data?.data || response.data;
        
        if (treeData) {
          setTree(treeData);
          setError(null);
        } else {
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Failed to load subject tree:', err);
        setError('Failed to load subject content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchTree();
    }
  }, [subjectId]);

  if (loading) {
    return (
      <AppLayout sidebar={<SubjectSidebar />}>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error || !tree) {
    return (
      <AppLayout sidebar={<SubjectSidebar />}>
        <div className="max-w-4xl">
          <Alert type="error" message={error || 'Subject not found'} onClose={() => setError(null)} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout sidebar={<SubjectSidebar />}>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {tree.title}
        </h1>
        
        {tree.description && (
          <p className="text-gray-600 mb-8">
            {tree.description}
          </p>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            How to use this page
          </h2>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li>Browse sections and videos in the left sidebar</li>
            <li>Click on any unlocked video to start watching</li>
            <li>Your progress is automatically tracked</li>
            <li>Completed videos are marked with a green checkmark</li>
          </ul>
        </div>

        {/* Optional: Display sections inline if needed */}
        {tree.sections && tree.sections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Course Content
            </h2>
            <div className="space-y-6">
              {tree.sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {section.title}
                  </h3>
                  
                  {section.videos && section.videos.length > 0 && (
                    <div className="space-y-2">
                      {section.videos.map((video) => (
                        <div
                          key={video.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            {video.isCompleted ? (
                              <span className="text-green-500">✓</span>
                            ) : video.isLocked ? (
                              <span className="text-gray-400">🔒</span>
                            ) : (
                              <span className="text-blue-500">▶</span>
                            )}
                            <span className="text-gray-800">{video.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {Math.floor(video.durationSeconds / 60)}:{String(video.durationSeconds % 60).padStart(2, '0')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SubjectPage;
