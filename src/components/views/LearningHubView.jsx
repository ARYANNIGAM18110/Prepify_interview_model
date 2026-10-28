import React, { useState, useEffect } from 'react';
import { Sparkles, Award, ExternalLink, Loader2 } from 'lucide-react';
import { api } from '../../api/client.js';

export default function LearningHubView({ onOpenQuiz, showToast }) {
  const [careerGoal, setCareerGoal] = useState('');
  const [generatedPath, setGeneratedPath] = useState(null);
  const [isPathLoading, setIsPathLoading] = useState(false);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    async function loadResources() {
      try {
        const res = await api.getLearningResources();
        setResources(res.resources || []);
      } catch {
        // Fallback resources
        setResources([
          { id: 'lr1', title: 'React 19 & Next.js Masterclass', category: 'Frontend', type: 'Video Course', duration: '4.5 hrs' },
          { id: 'lr2', title: 'Modern CSS Grids & Tailwind in Depth', category: 'Frontend', type: 'Article', duration: '15 min' },
          { id: 'lr3', title: 'Scalable Microservices with Node.js', category: 'Backend', type: 'Tutorial', duration: '45 min' },
          { id: 'lr4', title: 'Database Indexing & ACID Principles', category: 'Backend', type: 'Article', duration: '20 min' }
        ]);
      }
    }
    loadResources();
  }, []);

  const handleGenerateLearningPath = async () => {
    if (!careerGoal.trim()) {
      showToast('Enter a target goal first (e.g. Fullstack React & Node Engineer).');
      return;
    }
    setIsPathLoading(true);
    setGeneratedPath(null);
    try {
      const res = await api.generateLearningPath(careerGoal);
      setGeneratedPath(res.text);
    } catch (err) {
      showToast(err.message || 'Failed to generate roadmap.');
    } finally {
      setIsPathLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Career Skill & Learning Hub</h1>
        <p className="text-slate-500 text-sm mt-1">
          Targeted resources to master employer expectations, bridge knowledge gaps, and earn verified skill badges.
        </p>
      </div>

      {/* AI Custom Career Roadmap */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-bold uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Personalized AI Curriculum
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Generate Your Tailored Learning Path</h2>
          <p className="text-slate-300 text-sm mt-2">
            Enter your target specialization or internship ambition to construct a 4-step progressive master plan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value)}
            placeholder="e.g. Distributed Cloud & Golang Backend Engineer"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          />
          <button
            onClick={handleGenerateLearningPath}
            disabled={isPathLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition disabled:opacity-50"
          >
            {isPathLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Roadmap'}
          </button>
        </div>

        {generatedPath && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-sm text-slate-100 space-y-3">
            <h3 className="font-bold text-purple-300 text-base">Your Custom Milestones:</h3>
            <div className="whitespace-pre-line leading-relaxed">{generatedPath}</div>
          </div>
        )}
      </div>

      {/* Quizzes & Badge Earners */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-pink-600 font-bold text-xs uppercase">
            <Award className="w-4 h-4" />
            Skill Verification
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Earn Verified Knowledge Badges</h3>
          <p className="text-slate-600 text-sm max-w-xl">
            Take a 3-question AI generated quiz in your domain. Score at least 50% to attach a verified badge directly to your student dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Frontend', 'Backend', 'Data Science', 'Cloud', 'Design'].map((cat) => (
            <button
              key={cat}
              onClick={() => onOpenQuiz(cat)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition"
            >
              Quiz: {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Curated Resources Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900">Curated Learning Material</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
                  <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md">
                    {res.category}
                  </span>
                  <span>{res.duration}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{res.title}</h3>
                <p className="text-xs text-slate-500">{res.type}</p>
              </div>
              <button
                onClick={() => showToast(`Resource unlocked: ${res.title}`)}
                className="mt-6 flex items-center justify-center gap-1.5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition"
              >
                Access Course <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
