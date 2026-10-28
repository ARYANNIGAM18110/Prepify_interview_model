import React, { useState } from 'react';
import { Clock, Heart, Award, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardView({
  internships,
  savedIds,
  applications,
  badges,
  onSaveToggle,
  onApplyDirect
}) {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isRecLoading, setIsRecLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsRecLoading(true);
    try {
      const savedTitles = internships.filter((i) => savedIds.includes(i.id)).map((i) => i.title);
      const appliedTitles = applications.map((a) => a.jobTitle);
      const combined = [...new Set([...savedTitles, ...appliedTitles])];

      const res = await api.getRecommendations(combined);
      setRecommendations(res.recommendations || []);
    } catch {
      setRecommendations([
        'Fullstack React & Node.js Engineer - High alignment with modern web stack',
        'Cloud Solutions Architect Intern - Build containerization & deployment pipelines'
      ]);
    } finally {
      setIsRecLoading(false);
    }
  };

  const savedJobs = internships.filter((i) => savedIds.includes(i.id));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dashboard Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-purple-300">
            Candidate Dashboard
          </span>
          <h1 className="text-3xl font-extrabold mt-1">Welcome back, {currentUser?.name}!</h1>
          <p className="text-slate-300 text-sm mt-1">
            Track your saved opportunities, active application milestones, and verified skill badges.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center">
            <div className="text-2xl font-black">{applications.length}</div>
            <div className="text-xs text-slate-300 font-medium">Applied</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center">
            <div className="text-2xl font-black">{savedIds.length}</div>
            <div className="text-xs text-slate-300 font-medium">Saved</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center">
            <div className="text-2xl font-black">{badges.length}</div>
            <div className="text-xs text-slate-300 font-medium">Badges</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Applications & Saved Jobs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Application History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Application History
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {applications.length} Submitted
              </span>
            </div>

            {applications.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                You haven't submitted any applications yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 text-slate-500 text-xs font-semibold">
                    <tr>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80">
                        <td className="py-3 font-semibold text-slate-800">{app.jobTitle}</td>
                        <td className="py-3 text-slate-600">{app.company}</td>
                        <td className="py-3 text-slate-400 text-xs">{app.date}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Saved Internships */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Bookmarked Roles
              </h3>
              <span className="text-xs font-semibold text-slate-500">{savedIds.length} Saved</span>
            </div>

            {savedJobs.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                No saved internships yet. Browse the listing to bookmark roles.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-purple-600">{job.company}</div>
                      <h4 className="font-bold text-slate-900 mt-0.5">{job.title}</h4>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>{job.location}</span> • <span>{job.stipend}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => onApplyDirect(job)}
                        className="w-full text-xs font-bold py-2 px-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => onSaveToggle(job.id)}
                        className="text-xs font-bold py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Badges & AI Recommendations */}
        <div className="space-y-8">
          {/* Badges Earned */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Verified Badges
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Complete skill quizzes in the Learning Hub to verify your strengths.
            </p>

            {badges.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No badges earned yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {b}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Career Recommender */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI Career Matcher</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Synthesizes your applications and saved profiles to uncover high-impact target roles.
            </p>

            <button
              onClick={handleGetRecommendations}
              disabled={isRecLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition shadow-sm text-xs disabled:opacity-50"
            >
              {isRecLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Generate Career Matches'
              )}
            </button>

            {recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-white/90 rounded-xl border border-purple-100 text-xs text-slate-700 space-y-2">
                {recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">•</span>
                    <span>{rec.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
