import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { api } from '../../api/client.js';

export default function CompanyGatewayView({ onPostSuccess, showToast }) {
  const [companyForm, setCompanyForm] = useState({
    title: '',
    company: '',
    location: 'Remote',
    duration: '3 Months',
    stipend: '₹30,000/mo',
    ppoChance: 'High',
    skills: '',
    mentor: true,
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.postInternship(companyForm);
      if (res.success) {
        showToast('Internship role posted live to candidates!');
        if (onPostSuccess) onPostSuccess(res.item);
        setCompanyForm({
          title: '',
          company: '',
          location: 'Remote',
          duration: '3 Months',
          stipend: '₹30,000/mo',
          ppoChance: 'High',
          skills: '',
          mentor: true,
          description: ''
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to publish internship.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Employer Gateway
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Partner With Top Tech Talent</h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Deploy structured internships using the Purpose-Process-Placement framework. Post verified roles directly into our student portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-purple-600">Step 1</span>
          <h3 className="font-bold text-slate-900 text-lg mt-1 mb-2">Define Purpose</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Articulate measurable project goals. High clarity drives higher student engagement and better final project deliveries.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-pink-600">Step 2</span>
          <h3 className="font-bold text-slate-900 text-lg mt-1 mb-2">Structured Process</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Assign dedicated mentors and run bi-weekly milestones tracked through the Prepify candidate dashboard.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-orange-600">Step 3</span>
          <h3 className="font-bold text-slate-900 text-lg mt-1 mb-2">Placement Pipeline</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Convert verified high performers with Pre-Placement Offers (PPO) without redundant lateral hiring cycles.
          </p>
        </div>
      </div>

      {/* Post Internship Live Form */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-purple-600" />
          Post a New Internship Opportunity
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                required
                value={companyForm.title}
                onChange={(e) => setCompanyForm({ ...companyForm, title: e.target.value })}
                placeholder="e.g. Frontend Engineering Intern"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyForm.company}
                onChange={(e) => setCompanyForm({ ...companyForm, company: e.target.value })}
                placeholder="e.g. Acme Labs"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={companyForm.location}
                onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                placeholder="Remote / Bangalore / Hybrid"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Stipend</label>
              <input
                type="text"
                value={companyForm.stipend}
                onChange={(e) => setCompanyForm({ ...companyForm, stipend: e.target.value })}
                placeholder="₹35,000/mo"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PPO Opportunity</label>
              <select
                value={companyForm.ppoChance}
                onChange={(e) => setCompanyForm({ ...companyForm, ppoChance: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              value={companyForm.skills}
              onChange={(e) => setCompanyForm({ ...companyForm, skills: e.target.value })}
              placeholder="React, TypeScript, Tailwind, REST"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Role Description</label>
            <textarea
              rows={4}
              value={companyForm.description}
              onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
              placeholder="Describe project responsibilities, team structure, and mentorship highlights..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="mentorCheck"
              checked={companyForm.mentor}
              onChange={(e) => setCompanyForm({ ...companyForm, mentor: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="mentorCheck" className="text-xs font-medium text-slate-700">
              Dedicated 1-on-1 Senior Engineer Mentorship Included
            </label>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Internship to Gateway'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
