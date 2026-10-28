import React from 'react';
import { Sparkles, ArrowRight, Bot, Award, Loader2 } from 'lucide-react';
import InternshipCard from '../internships/InternshipCard.jsx';

export default function HomeView({
  internships,
  savedIds,
  isLoading,
  sortFilter,
  setSortFilter,
  onNavigate,
  onSave,
  onApply,
  onDayInLife
}) {
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[380px] flex items-center p-8 sm:p-14 shadow-2xl">
        <div
          className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-1" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            Your 3-P Career Framework
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Land Dream Internships. <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
              Convert To Full-Time Roles.
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Prepify combines curated high-PPO opportunities with real-time AI interview simulations,
            custom skill-learning tracks, and automatic resume intelligence.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('internships')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg shadow-purple-500/20 transition"
            >
              Explore Internships <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('interview')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-200 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition"
            >
              Try AI Interview Prep <Bot className="w-4 h-4 text-purple-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats & 3-P Value Prop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Purpose',
            desc: 'Target verified companies offering dedicated mentorship, clear project scopes, and meaningful tasks.',
            icon: Sparkles,
            color: 'text-purple-600 bg-purple-50'
          },
          {
            title: 'Process',
            desc: 'AI mock interviews simulate real-world technical and behavioural evaluation loops with voice feedback.',
            icon: Bot,
            color: 'text-pink-600 bg-pink-50'
          },
          {
            title: 'Placement',
            desc: 'Accelerated track to Pre-Placement Offers (PPOs) and tracked application pipeline analytics.',
            icon: Award,
            color: 'text-orange-600 bg-orange-50'
          }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Featured Internships Carousel / Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">High-PPO Featured Internships</h2>
            <p className="text-slate-500 text-sm">Roles with direct full-time conversion opportunities</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['popular', 'rated', 'newest'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSortFilter(filter)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  sortFilter === filter
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-purple-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.slice(0, 6).map((job) => (
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
    </div>
  );
}
