import React from 'react';

interface TagProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
  variant?: 'default' | 'highlight';
}

export const Tag: React.FC<TagProps> = ({ label, onRemove, onClick, variant = 'default' }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200";
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200",
    highlight: "bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200",
  };

  return (
    <span 
      className={`${baseClasses} ${variants[variant]} ${onClick ? 'cursor-pointer' : ''} mr-2 mb-2`}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 rounded-full hover:bg-slate-300 items-center justify-center focus:outline-none"
        >
          <span className="sr-only">Remove {label}</span>
          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </span>
  );
};