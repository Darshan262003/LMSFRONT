const VideoProgressBar = ({ currentTime, duration }: any) => {
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
        <span>Progress</span>
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {percentage >= 100 ? (
          <span className="text-green-600 font-medium">Completed!</span>
        ) : (
          <span>{percentage.toFixed(1)}% complete</span>
        )}
      </div>
    </div>
  );
};

export default VideoProgressBar;
