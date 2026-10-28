import React from 'react';
import { Search } from 'lucide-react';
import InternshipCard from '../internships/InternshipCard.jsx';

export default function InternshipsView({
  internships,
  savedIds,
  sortFilter,
  setSortFilter,
  onSave,
  onApply,
  onDayInLife
}) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Curated Opportunities</h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover roles with transparent stipends, verified mentorship, and high conversion probability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase">Sort by:</span>
          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="popular">Most Popular</option>
            <option value="rated">Highest Rated</option>
            <option value="newest">Recently Posted</option>
          </select>
        </div>
      </div>

      {internships.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No matching internships found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Try adjusting your search terms or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((job) => (
            <InternshipCard
              key={job.id}
              job={job}
              isSaved={savedIds.includes(job.id)}
              onSave={() => onSave(job.id)}
              onApply={() => onApply(job)}
              onDayInLife={() => onDayInLife(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
