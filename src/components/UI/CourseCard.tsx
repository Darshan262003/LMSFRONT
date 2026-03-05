import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface CourseCardProps {
  id: string;
  name: string;
  description?: string;
}

const getSubjectImage = (title: string) => {
  if (title.toLowerCase().includes("java") && !title.toLowerCase().includes("script")) {
    return "https://cdn-icons-png.flaticon.com/512/226/226777.png";
  }
  if (title.toLowerCase().includes("python")) {
    return "https://cdn-icons-png.flaticon.com/512/5968/5968350.png";
  }
  if (title.toLowerCase().includes("javascript")) {
    return "https://cdn-icons-png.flaticon.com/512/5968/5968292.png";
  }
  return "";
};

const CourseCard = ({ id, name, description }: CourseCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div
      key={id}
      className="bg-white rounded-xl shadow-md border hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer p-6"
      onClick={() => navigate(`/subjects/${id}`)}
    >
      <img
        src={getSubjectImage(name)}
        alt={name}
        className="w-16 h-16 mb-4 object-contain"
      />
      
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {name}
      </h2>
      
      <Button variant="primary" size="sm">
        Start Course
      </Button>
    </div>
  );
};

export default CourseCard;
