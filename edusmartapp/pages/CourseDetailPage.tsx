import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROGRAMS } from '../constants';
import ProgramBadge from '../components/ProgramBadge';
import { MaterialType } from '../types';
import Icon from '../components/Icon';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n/index';

const MaterialIcon: React.FC<{ type: MaterialType }> = ({ type }) => {
  const icons = {
    pdf: '📄',
    video: '🎥',
    slides: '🖥️',
    quiz: '❓',
    assignment: '📝',
  };
  return <span className="text-3xl mr-5">{icons[type] || '📎'}</span>;
};

const BACKEND_BASE_URL = 'http://localhost:3001'; // change to your backend URL as needed

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById } = useData();
  const { t } = useLanguage();
  const course = courseId ? getCourseById(courseId) : undefined;

  if (!course) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold text-ui-red tracking-tight">{t('courseNotFound')}</h2>
        <Link to="/courses" className="mt-4 inline-block text-ui-primary hover:underline">
          &larr; {t('backToCourses')}
        </Link>
      </div>
    );
  }

  const program = PROGRAMS.find((p) => p.id === course.programId);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <div className="flex justify-between items-start mb-4">
          {program && <ProgramBadge program={program} />}
          <Link to="/courses" className="text-md font-medium text-ui-primary hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToCourses')}
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ui-text-primary tracking-tight">{course.name}</h1>
        <p className="text-xl text-ui-text-secondary font-mono mt-1">{course.code}</p>
        <p className="text-ui-text-secondary mt-4 max-w-3xl text-lg">{course.description}</p>
        <button className="mt-8 w-full sm:w-auto bg-ui-primary text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-80 transition-all flex items-center justify-center text-lg transform hover:scale-105 active:scale-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          {t('startStudying')}
        </button>
      </div>

      <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <h2 className="text-2xl font-bold text-ui-text-primary mb-6 tracking-tight">{t('courseMaterials')}</h2>
        {course.materials.length > 0 ? (
          <ul className="space-y-3">
            {course.materials.map((material) => {
              const rawUrl = material.url;
              const fileUrl = rawUrl.startsWith('/uploads/')
                ? `${BACKEND_BASE_URL}${rawUrl}`
                : `${BACKEND_BASE_URL}/uploads/${rawUrl}`;
              return (
                <li
                  key={material.id}
                  className="flex items-center bg-ui-hover p-4 rounded-xl hover:bg-ui-border/50 transition-colors cursor-pointer justify-between"
                >
                  <div className="flex items-center">
                    <MaterialIcon type={material.type} />
                    <div>
                      <span className="font-semibold text-ui-text-primary text-lg">{material.title}</span>
                      <span className="block text-sm uppercase font-semibold text-ui-text-secondary tracking-wider">{material.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(material.type === 'PDF' || material.type === 'DOC') && (
                      <>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          View
                        </a>
                        <a
                          href={fileUrl}
                          download
                          className="p-2 bg-gray-100 text-blue-600 border border-blue-600 rounded hover:bg-gray-200 transition flex items-center justify-center"
                          title="Download"
                        >
                          <Icon name="download" className="w-4 h-4" />
                        </a>
                      </>
                    )}
                    {material.type === 'VIDEO' && (
                      <video controls width={160} className="rounded">
                        <source src={fileUrl} type="video/mp4" />
                      </video>
                    )}
                    {material.type === 'LINK' && (
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Visit Link
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-ui-text-secondary text-lg">{t('noMaterialsAvailable')}</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
