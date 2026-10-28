import React from 'react';
import { MapPin, DollarSign, Clock, Heart } from 'lucide-react';

export default function InternshipCard({ job, isSaved, onSave, onApply, onDayInLife }) {
  const ppoBadges = {
    High: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    Low: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between">
      <div>
        {/* Top Company & PPO badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            {job.company}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              ppoBadges[job.ppoChance] || ppoBadges.Medium
            }`}
          >
            {job.ppoChance} PPO
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h3>

        {/* Meta details */}
        <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-slate-500 mt-2 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> {job.stipend}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {job.duration}
          </span>
        </div>

        {/* Skills pill tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.skills && job.skills.map((skill, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Row */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex gap-2">
          <button
            onClick={onApply}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Apply Now
          </button>
          <button
            onClick={onSave}
            className={`p-2 rounded-xl border transition ${
              isSaved
                ? 'bg-pink-50 text-pink-600 border-pink-200'
                : 'text-slate-400 hover:text-pink-600 border-slate-200 hover:bg-pink-50'
            }`}
            title="Bookmark role"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        <button
          onClick={onDayInLife}
          className="w-full py-1.5 text-xs text-purple-600 font-bold hover:bg-purple-50 rounded-lg transition"
        >
          ✨ A Day in the Life
        </button>
      </div>
    </div>
  );
}
