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

  // Helper function to extract YouTube ID and return embed URL
  function getYoutubeEmbedUrl(url: string): string {
    if (!url) return "";
    
    let videoId = "";
    
    try {
      // Handle youtu.be short URLs (e.g., https://youtu.be/bm0OyhwFDuY?si=...)
      if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } 
      // Handle youtube.com/watch URLs (e.g., https://youtube.com/watch?v=...)
      else if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v") || "";
      }
      // Handle youtube.com/embed URLs (already in correct format)
      else if (url.includes("youtube.com/embed")) {
        return url;
      }
      // Fallback: try to extract ID using regex
      else {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))(?<id>[a-zA-Z0-9_-]+)/);
        videoId = match?.groups?.id || "";
      }
    } catch (e) {
      console.error('Failed to parse YouTube URL:', e);
      // Last resort regex fallback
      const match = url.match(/[?&]v=([^&]+)/);
      videoId = match?.[1] || "";
    }
    
    return `https://www.youtube.com/embed/${videoId}`;
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

  if (!video?.youtubeUrl) {
    return (
      <AppLayout sidebar={<SubjectSidebar />}>
        <div className="max-w-4xl">
          <Alert type="error" message="No video URL found" onClose={() => setError(null)} />
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
            src={getYoutubeEmbedUrl(video.youtubeUrl)}
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
