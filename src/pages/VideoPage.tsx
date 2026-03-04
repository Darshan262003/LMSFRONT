import AppLayout from '../components/Layout/AppLayout';
import SubjectSidebar from '../components/Sidebar/SubjectSidebar';
import VideoPlayer from '../components/Video/VideoPlayer';

const VideoPage = () => {
  return (
    <AppLayout sidebar={<SubjectSidebar />}>
      <div className="max-w-5xl">
        <VideoPlayer />
      </div>
    </AppLayout>
  );
};

export default VideoPage;
