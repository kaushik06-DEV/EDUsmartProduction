import React, { useState, useMemo, useEffect } from 'react';
import { PROGRAMS } from '../constants';
import CourseCard from '../components/CourseCard';
import { ProgramId } from '../types';
import Icon from '../components/Icon';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n/index';

const CoursesPage: React.FC = () => {
    const { courses } = useData();
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrograms, setSelectedPrograms] = useState<Set<ProgramId>>(new Set());
    const [selectedLevels, setSelectedLevels] = useState<Set<number>>(new Set());

    // Modal state for viewing materials
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [materials, setMaterials] = useState<any[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    const handleProgramToggle = (programId: ProgramId) => {
        setSelectedPrograms(prev => {
            const newSet = new Set<ProgramId>();
            if (!prev.has(programId)) {
                newSet.add(programId);
            }
            return newSet;
        });
    };

    const handleLevelToggle = (level: number) => {
        setSelectedLevels(prev => {
            const newSet = new Set<number>();
            if (!prev.has(level)) {
                newSet.add(level);
            }
            return newSet;
        });
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedPrograms(new Set());
        setSelectedLevels(new Set());
    };

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesProgram = selectedPrograms.size === 0 || selectedPrograms.has(course.programId);
            const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = selectedLevels.size === 0 || selectedLevels.has(course.level);
            return matchesProgram && matchesSearch && matchesLevel;
        });
    }, [searchTerm, selectedPrograms, selectedLevels, courses]);

    const hasActiveFilters = selectedPrograms.size > 0 || selectedLevels.size > 0;

    // Fetch materials when a course is selected
    useEffect(() => {
        if (!selectedCourse) return;
        setLoadingMaterials(true);
        fetch(`/api/courses/${selectedCourse._id}/materials?programId=${selectedCourse.programId}`)
            .then(res => res.json())
            .then(data => setMaterials(data))
            .catch(() => setMaterials([]))
            .finally(() => setLoadingMaterials(false));
    }, [selectedCourse]);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="relative max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder={t('searchForCourses')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 bg-white border-2 border-ui-border rounded-full shadow-apple text-ui-text-primary placeholder-ui-text-secondary focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary focus:outline-none transition"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Icon name="search" className="w-6 h-6 text-ui-text-secondary" />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-ui-text-secondary">{t('filterByProgram')}</h3>
                    {selectedPrograms.size > 0 && (
                        <button
                            onClick={() => setSelectedPrograms(new Set())}
                            className="text-sm text-ui-text-secondary hover:text-ui-primary"
                        >
                            {t('clear')}
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                    {PROGRAMS.map(program => (
                        <button
                            key={program.id}
                            onClick={() => handleProgramToggle(program.id)}
                            className={`px-5 py-2 text-md font-semibold rounded-full transition-all duration-200 border-2 ${
                                selectedPrograms.has(program.id)
                                    ? `${program.color} text-white border-transparent shadow-md`
                                    : 'bg-ui-card text-ui-text-primary border-ui-border hover:bg-ui-hover hover:border-transparent'
                            }`}
                            aria-pressed={selectedPrograms.has(program.id)}
                        >
                            {program.shortName}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-ui-card rounded-2xl shadow-apple p-6 space-y-6">
                <h3 className="text-lg font-semibold text-ui-text-primary">{t('advancedFilters')}</h3>
                <div className="space-y-6 pt-6 border-t border-ui-border">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-medium text-ui-text-secondary">{t('courseLevel')}</h4>
                            {selectedLevels.size > 0 && (
                                <button
                                    onClick={() => setSelectedLevels(new Set())}
                                    className="text-sm text-ui-text-secondary hover:text-ui-primary"
                                >
                                    {t('clear')}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {[1, 2, 3, 4].map(level => (
                                <button
                                    key={level}
                                    onClick={() => handleLevelToggle(level)}
                                    className={`px-5 py-2 text-md font-semibold rounded-full transition-all duration-200 border-2 ${
                                        selectedLevels.has(level)
                                            ? 'bg-ui-primary text-white border-transparent shadow-md'
                                            : 'bg-ui-card text-ui-text-primary border-ui-border hover:bg-ui-hover hover:border-transparent'
                                    }`}
                                    aria-pressed={selectedLevels.has(level)}
                                >
                                    {t('yearLevel', { level })}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="pt-6 border-t border-ui-border">
                        <button
                            onClick={clearAllFilters}
                            className="w-full sm:w-auto px-6 py-2 bg-ui-hover text-ui-text-primary font-semibold rounded-lg hover:bg-ui-border transition-colors"
                        >
                            {t('clearAllFilters')}
                        </button>
                    </div>
                 )}
            </div>

            <div>
                <p className="text-md text-ui-text-secondary mb-6">{t('showingCourses', { count: filteredCourses.length, total: courses.length })}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map(course => (
                        <div key={course.id || course._id} onClick={() => setSelectedCourse(course)} style={{ cursor: 'pointer' }}>
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
                 {filteredCourses.length === 0 && (
                    <div className="text-center py-16 text-ui-text-secondary col-span-full bg-ui-card rounded-2xl shadow-apple">
                        <p className="text-xl font-semibold">{t('noCoursesFound')}</p>
                        <p className="text-lg">{courses.length > 0 ? t('adjustFilters') : t('adminNeedsToImportData')}</p>
                    </div>
                )}
            </div>

            {/* Modal for course materials */}
            {selectedCourse && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-8 max-w-lg w-full relative max-h-[80vh] overflow-auto">
      <button
        className="absolute top-2 right-2 text-xl"
        onClick={() => setSelectedCourse(null)}
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-4">{selectedCourse.title} Materials</h2>
      {loadingMaterials ? (
        <p>Loading materials...</p>
      ) : materials.length > 0 ? (
        <ul className="space-y-4">
          {materials.map((mat) => (
            <li key={mat._id} className="flex items-center gap-4 flex-wrap">
              <span className="flex-1">{mat.title} ({mat.type})</span>
              {(mat.type === 'PDF' || mat.type === 'DOC') && (
                <>
                  <a
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    View
                  </a>
                  <a
                    href={mat.url}
                    download
                    className="p-2 bg-gray-100 text-blue-600 border border-blue-600 rounded hover:bg-gray-200 transition flex items-center justify-center"
                    title="Download"
                  >
                    <Icon name="download" className="w-4 h-4" />
                  </a>
                </>
              )}
              {mat.type === 'VIDEO' && (
                <video controls width={160} className="rounded">
                  <source src={mat.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {mat.type === 'LINK' && (
                <a
                  href={mat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Visit Link
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No materials found for this course.</p>
      )}
    </div>
  </div>
)}
        </div>
    );
};

export default CoursesPage;