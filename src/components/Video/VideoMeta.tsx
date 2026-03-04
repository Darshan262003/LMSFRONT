import { CheckCircle } from 'lucide-react';

const VideoMeta = ({ title, description, isCompleted }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex-1">{title}</h1>
        {isCompleted && (
          <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 ml-4" />
        )}
      </div>
      
      {description && (
        <p className="text-gray-600 leading-relaxed">{description}</p>
      )}
    </div>
  );
};

export default VideoMeta;
