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
  description?: string;
  youtubeUrl: string;
  durationSeconds: number;
  orderIndex: number;
  isLocked: boolean;
  isCompleted: boolean;
}

const VideoPage = () => {
  const { subjectId, videoId } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/subjects/${subjectId}/tree`);
        
        // Backend returns: { success: true, data: {...} }
        const treeData = response.data?.data || response.data;
        
        if (treeData && treeData.sections) {
          // Find the selected video in all sections
          const found = treeData.sections
            .flatMap(section => section.videos || [])
            .find(v => String(v.id) === String(videoId));
          
          if (found) {
            setVideo(found);
            setError(null);
          } else {
            setError('Video not found');
          }
        }
      } catch (err) {
        console.error('Failed to load video:', err);
        setError('Failed to load video. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (subjectId && videoId) {
      fetchVideo();
    }
  }, [subjectId, videoId]);

  // Helper function to extract YouTube ID from URL
  function getYoutubeId(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v') || '';
    } catch (e) {
      // If URL parsing fails, try regex fallback
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))(?<id>[a-zA-Z0-9_-]+)/);
      return match?.groups?.id || '';
    }
  }

  if (loading) {
    return (
      <AppLayout sidebar={<SubjectSidebar />}>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error || !video) {
    return (
      <AppLayout sidebar={<SubjectSidebar />}>
        <div className="max-w-4xl">
          <Alert type="error" message={error || 'Video not found'} onClose={() => setError(null)} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout sidebar={<SubjectSidebar />}>
      <div className="max-w-5xl">
        {/* Video Player */}
        <div className="video-player-wrapper">
          <iframe
            className="video-player-iframe"
            src={`https://www.youtube.com/embed/${getYoutubeId(video.youtubeUrl)}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div className="video-meta">
          <h1 className="video-title-large">{video.title}</h1>
          {video.description && (
            <p className="video-description-large">{video.description}</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default VideoPage;
