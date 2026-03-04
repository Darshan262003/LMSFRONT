import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sidebarStore } from '../../stores/sidebarStore';
import { authStore } from '../../stores/authStore';
import Spinner from '../UI/Spinner';
import Alert from '../UI/Alert';
import SectionItem from './SectionItem';

const SubjectSidebar = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { tree, loading, error, fetchTree } = sidebarStore();
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (subjectId && isAuthenticated) {
      fetchTree(subjectId);
    }
  }, [subjectId, isAuthenticated]);

  if (loading) {
    return (
      <div className="p-4">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert type="error" message={error} />
      </div>
    );
  }

  if (!tree) {
    console.log('[SubjectSidebar] No tree available');
    return null;
  }
  
  console.log('[SubjectSidebar] Rendering tree:', tree);
  console.log('[SubjectSidebar] Sections:', tree.sections);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">{tree.subjectName}</h2>
      
      <div className="space-y-4">
        {tree.sections?.map((section, index) => {
          console.log('[SubjectSidebar] Rendering section:', section);
          console.log('[SubjectSidebar] Section videos:', section.videos);
          return (
            <SectionItem 
              key={section.id || index} 
              section={section} 
              level={0}
              onVideoClick={(videoId) => {
                console.log('[SubjectSidebar] Video clicked, navigating to:', `/subjects/${subjectId}/video/${videoId}`);
                navigate(`/subjects/${subjectId}/video/${videoId}`);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSidebar;
