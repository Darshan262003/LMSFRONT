import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
// import apiClient from '../../services/apiClient';
import { videoStore } from '../../stores/videoStore';
import { sidebarStore } from '../../stores/sidebarStore';
import VideoMeta from './VideoMeta';
import VideoProgressBar from './VideoProgressBar';
import Spinner from '../UI/Spinner';
import Alert from '../UI/Alert';

interface VideoData {
  id?: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  nextVideoId?: string | null;
  prevVideoId?: string | null;
  lastPositionSeconds?: number;
}

const VideoPlayer = () => {
  const { subjectId, videoId } = useParams();
  const iframeRef = useRef(null);
  const progressIntervalRef = useRef(null);
  
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  
  const { 
    currentTime, 
    duration, 
    isCompleted,
    setCurrentTime, 
    setDuration,
    setIsCompleted,
    setNextVideoId,
    setPrevVideoId,
  } = videoStore() as any;
  
  const { markVideoCompleted } = sidebarStore() as any;

  // Fetch video data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call when backend is available
        // const response = await apiClient.get(`/videos/${videoId}`);
        // setVideoData(response.data);
          
        // Mock video data for demonstration (remove when backend is connected)
        const mockVideoData = {
          id: videoId,
          title: `Video ${videoId}`,
          description: 'This is a sample video description',
          youtubeVideoId: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up (test video)
          nextVideoId: null,
          prevVideoId: null,
          lastPositionSeconds: 0,
        };
          
        setVideoData(mockVideoData);
          
        // Set next and prev video IDs if available
        if (mockVideoData.nextVideoId) {
          setNextVideoId(mockVideoData.nextVideoId);
        }
        if (mockVideoData.prevVideoId) {
          setPrevVideoId(mockVideoData.prevVideoId);
        }
          
        // Restore last position if available
        if (mockVideoData.lastPositionSeconds) {
          setCurrentTime(mockVideoData.lastPositionSeconds);
        }
          
        setError(null);
      } catch (err) {
        setError('Failed to load video data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
      
    fetchVideoData();
  }, [videoId]);

  // Send progress every 10 seconds (disabled in mock mode)
  useEffect(() => {
    if (playerReady && videoId && currentTime > 0) {
      // TODO: Re-enable progress tracking when backend is available
      // progressIntervalRef.current = setInterval(async () => {
      //   try {
      //     await apiClient.post(`/progress/videos/${videoId}`, {
      //       last_position_seconds: Math.floor(currentTime),
      //     });
      //   } catch (err) {
      //     console.error('Failed to send progress:', err);
      //   }
      // }, 10000);
        
      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [videoId, currentTime, playerReady]);

  // Handle video end (disabled in mock mode)
  const handleVideoEnd = async () => {
    try {
      // TODO: Re-enable progress tracking when backend is available
      // await apiClient.post(`/progress/videos/${videoId}`, {
      //   last_position_seconds: Math.floor(duration),
      //   is_completed: true,
      // });
        
      // Update stores
      setIsCompleted(true);
      markVideoCompleted(videoId);
        
      // Navigate to next video if available
      const nextVideoId = (videoStore.getState() as any).nextVideoId;
      if (nextVideoId) {
        setTimeout(() => {
          window.location.href = `/subjects/${subjectId}/video/${nextVideoId}`;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to mark video as completed:', err);
    }
  };

  // YouTube player message handler
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;

      const data = JSON.parse(event.data);

      if (data.event === 'infoDelivery' && data.info) {
        const { currentTime: newCurrentTime, duration: newDuration } = data.info;
        
        if (newCurrentTime !== undefined) {
          setCurrentTime(newCurrentTime);
        }
        
        if (newDuration !== undefined) {
          setDuration(newDuration);
        }
      }

      if (data.event === 'onStateChange') {
        if (data.info === 0) { // Video ended
          handleVideoEnd();
        }
      }

      if (data.event === 'onReady') {
        setPlayerReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [duration]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="p-4">
        <Alert type="error" message={error || 'Video not found'} onClose={() => setError(null)} />
      </div>
    );
  }

  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoData.youtubeVideoId}?enablejsapi=1&start=${Math.floor(currentTime)}`;

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={youtubeEmbedUrl}
          title={videoData.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Info */}
      <VideoMeta
        title={videoData.title}
        description={videoData.description}
        isCompleted={isCompleted}
      />

      {/* Progress Bar */}
      <VideoProgressBar
        currentTime={currentTime}
        duration={duration}
      />
    </div>
  );
};

export default VideoPlayer;
