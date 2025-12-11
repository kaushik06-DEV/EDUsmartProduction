import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../i18n/index';

const RequestBookPage: React.FC = () => {
  const { courses, bookRequests, addBookRequest } = useData();
  const { t } = useLanguage();
  const [bookTitle, setBookTitle] = useState('');
  const [selectedCourseName, setSelectedCourseName] = useState(courses.length > 0 ? courses[0].name : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !selectedCourseName) {
      alert(t('fillAllFields'));
      return;
    }
    addBookRequest({ bookTitle, courseName: selectedCourseName });
    setBookTitle('');
    alert(t('bookRequestSubmitted'));
  };

  const statusStyles = {
    Pending: 'bg-ui-yellow/20 text-yellow-800',
    Accepted: 'bg-ui-green/20 text-green-800',
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <h2 className="text-2xl font-bold text-ui-text-primary mb-2 tracking-tight">{t('requestABook')}</h2>
        <p className="text-ui-text-secondary mb-6 text-lg">{t('requestBookDescription')}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="bookTitle" className="block text-md font-medium text-ui-text-secondary">{t('bookTitle')}</label>
            <input
              type="text"
              id="bookTitle"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder={t('bookTitlePlaceholder')}
              className="mt-1 block w-full p-3 bg-ui-card border-2 border-ui-border rounded-xl shadow-sm text-ui-text-primary placeholder-ui-text-secondary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition"
              required
            />
          </div>
          <div>
            <label htmlFor="course" className="block text-md font-medium text-ui-text-secondary">{t('relevantCourse')}</label>
            <select
              id="course"
              value={selectedCourseName}
              onChange={(e) => setSelectedCourseName(e.target.value)}
              className="mt-1 block w-full p-3 bg-ui-card border-2 border-ui-border rounded-xl shadow-sm text-ui-text-primary focus:outline-none focus:ring-2 focus:ring-ui-primary/20 focus:border-ui-primary transition"
              required
              disabled={courses.length === 0}
            >
              {courses.length > 0 ? (
                courses.map(course => <option key={course.id} value={course.name}>{course.name}</option>)
              ) : (
                <option>{t('noCoursesAvailable')}</option>
              )}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-ui-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80 transition-colors disabled:bg-gray-400"
            disabled={courses.length === 0}
          >
            {t('submitRequest')}
          </button>
        </form>
      </div>

      <div className="bg-ui-card p-8 rounded-2xl shadow-apple">
        <h2 className="text-2xl font-bold text-ui-text-primary mb-6 tracking-tight">{t('yourRequestHistory')}</h2>
        {bookRequests.length > 0 ? (
          <ul className="space-y-4">
            {[...bookRequests].reverse().map(req => (
              <li key={req.id} className="p-4 bg-ui-hover rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-ui-text-primary text-lg">{req.bookTitle}</p>
                  <p className="text-md text-ui-text-secondary">{t('course')}: {req.courseName}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${statusStyles[req.status]}`}>
                  {t(req.status.toLowerCase())}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ui-text-secondary text-lg">{t('noBookRequestsMade')}</p>
        )}
      </div>
    </div>
  );
};

export default RequestBookPage;