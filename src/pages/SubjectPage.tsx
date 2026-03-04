import AppLayout from '../components/Layout/AppLayout';
import SubjectSidebar from '../components/Sidebar/SubjectSidebar';

const SubjectPage = () => {
  return (
    <AppLayout sidebar={<SubjectSidebar />}>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Subject Content
        </h1>
        <p className="text-gray-600 mb-8">
          Select a video from the sidebar to start learning.
        </p>
        
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
      </div>
    </AppLayout>
  );
};

export default SubjectPage;
