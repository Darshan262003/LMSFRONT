import CourseCard from './CourseCard';

interface Subject {
  id: string;
  name: string;
  description?: string;
}

interface CourseGridProps {
  subjects: Subject[];
}

const CourseGrid = ({ subjects }: CourseGridProps) => {
  return (
    <div className="course-grid">
      {subjects.map((subject) => (
        <CourseCard
          key={subject.id}
          id={subject.id}
          name={subject.name}
          description={subject.description}
        />
      ))}
    </div>
  );
};

export default CourseGrid;
