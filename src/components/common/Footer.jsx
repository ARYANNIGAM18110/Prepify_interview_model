import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-base">Prepify</span>
          <span>&copy; 2026 Prepify, Inc. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('internships')}>
            Internships
          </span>
          <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('learning')}>
            Learning
          </span>
          <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('interview')}>
            AI Mock
          </span>
          <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('company')}>
            Employers
          </span>
        </div>
      </div>
    </footer>
  );
}
