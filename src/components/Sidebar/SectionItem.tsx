import { ChevronDown, ChevronRight, Play, CheckCircle, Lock } from 'lucide-react';

const SectionItem = ({ section, level = 0, onVideoClick }: any) => {
  const isExpanded = true; // Could add state management for expand/collapse

  const renderIcon = (video: any) => {
    if (video.isCompleted || video.completed) {
      return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
    }
    if (video.isLocked || video.locked) {
      return <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
    return <Play className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  };

  const handleVideoClick = (video: any) => {
    if (!video.locked && onVideoClick) {
      onVideoClick(video.id);
    }
  };

  return (
    <div className="section-item">
      {/* Section Header */}
      <div
        className="section-header"
        style={{ marginLeft: `${level * 16}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
        <h3 className="section-title">{section.title}</h3>
      </div>

      {/* Videos */}
      {isExpanded && section.videos && (
        <div className="videos-list">
          {section.videos.map((video: any) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className={`video-item ${!video.isLocked && !video.locked ? 'clickable' : ''}`}
            >
              {renderIcon(video)}
              <span className="video-title">{video.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Subsections */}
      {isExpanded && section.subsections && (
        <div className="space-y-2">
          {section.subsections.map((subsection: any, index: any) => (
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
