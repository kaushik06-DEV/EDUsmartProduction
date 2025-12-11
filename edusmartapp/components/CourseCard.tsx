import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { PROGRAMS } from '../constants';
import ProgramBadge from './ProgramBadge';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const program = PROGRAMS.find(p => p.id === course.programId);

  return (
    <Link key={course.id} to={`/courses/${course.id}`} className="block bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start">
            {program && <ProgramBadge program={program} />}
             {program?.hasPartnership && (
                <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    TCS
                </span>
            )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mt-4 group-hover:text-blue-600 transition-colors">{course.name}</h3>
        <p className="text-sm text-gray-600">{course.code}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2 h-10">{course.description}</p>
         <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Industry Fit</span>
              <span className="font-semibold">{course.industryRelevance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1.5">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.industryRelevance}%` }}></div>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;