import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3 rounded-xl shadow-xl animate-bounce">
      <CheckCircle className="w-5 h-5" />
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
}
