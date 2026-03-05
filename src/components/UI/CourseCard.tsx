import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  name: string;
  description?: string;
}

const CourseCard = ({ id, name, description }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="course-card" onClick={() => navigate(`/subjects/${id}`)}>
      <div className="course-card-image">
        <img 
          src={`https://via.placeholder.com/400x225?text=${encodeURIComponent(name)}`} 
          alt={name}
          className="course-thumbnail"
        />
      </div>
      <div className="course-card-content">
        <h3 className="course-title">{name}</h3>
        {description && (
          <p className="course-description">{description}</p>
        )}
        <button className="start-learning-button">
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
