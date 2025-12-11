
import React from 'react';
import { useLanguage } from '../i18n';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  confirmButtonColor = 'bg-ui-red',
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-ui-card rounded-2xl shadow-apple-lg w-full max-w-md p-6 m-4 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 text-ui-red mx-auto rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 id="modal-title" className="text-2xl font-bold text-ui-text-primary">{title}</h3>
          <p className="mt-2 text-md text-ui-text-secondary">{message}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="w-full bg-ui-hover text-ui-text-primary font-bold py-3 px-4 rounded-xl hover:bg-ui-border transition-colors"
          >
            {cancelButtonText || t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`w-full ${confirmButtonColor} text-white font-bold py-3 px-4 rounded-xl hover:bg-opacity-80 transition-colors`}
          >
            {confirmButtonText || t('deleteCourse')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
