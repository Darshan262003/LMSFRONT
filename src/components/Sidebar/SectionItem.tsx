import { ChevronDown, ChevronRight, Play, CheckCircle, Lock } from 'lucide-react';

const SectionItem = ({ section, level = 0, onVideoClick }) => {
  const isExpanded = true; // Could add state management for expand/collapse

  const renderIcon = (video) => {
    if (video.completed) {
      return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    }
    if (video.locked) {
      return <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
    return <Play className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  };

  const handleVideoClick = (video) => {
    if (!video.locked && onVideoClick) {
      onVideoClick(video.id);
    }
  };

  return (
    <div className="space-y-2">
      {/* Section Header */}
      <div
        className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        style={{ marginLeft: `${level * 16}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
        <h3 className="font-semibold text-gray-700 flex-1">{section.title}</h3>
      </div>

      {/* Videos */}
      {isExpanded && section.videos && (
        <div className="space-y-1">
          {section.videos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className={`flex items-center gap-3 py-2 px-3 ml-6 rounded-lg cursor-pointer transition-colors ${
                video.locked
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {renderIcon(video)}
              <span className="flex-1 text-sm">{video.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Subsections */}
      {isExpanded && section.subsections && (
        <div className="space-y-2">
          {section.subsections.map((subsection, index) => (
            <SectionItem
              key={subsection.id || index}
              section={subsection}
              level={level + 1}
              onVideoClick={onVideoClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionItem;
