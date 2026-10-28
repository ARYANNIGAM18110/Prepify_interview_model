import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Loader2 } from 'lucide-react';
import ModalWrapper from '../common/ModalWrapper.jsx';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ApplyModal({ job, onClose, onSubmitSuccess, showToast, onOpenLogin }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: ''
  });
  const [aiHelperText, setAiHelperText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const handleImproveResume = async () => {
    if (!formData.resume.trim()) {
      setAiHelperText('Please paste your resume content in the box above first.');
      return;
    }
    setIsAiLoading(true);
    setAiHelperText('');
    try {
      const res = await api.improveResume(formData.resume);
      setAiHelperText(res.text);
    } catch (err) {
      setAiHelperText(err.message || 'Failed to refine resume.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!formData.resume.trim()) {
      setAiHelperText('Please paste your resume content in the box first so we can tailor your cover letter.');
      return;
    }
    setIsAiLoading(true);
    setAiHelperText('');
    try {
      const res = await api.generateCoverLetter(formData.resume, job.title, job.company);
      setAiHelperText(res.text);
    } catch (err) {
      setAiHelperText(err.message || 'Failed to generate cover letter.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please log in to submit your official application.');
      onOpenLogin();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitApplication({
        internshipId: job.id,
        jobTitle: job.title,
        company: job.company,
        candidateName: formData.name,
        email: formData.email,
        resumeText: formData.resume
      });

      if (res.success) {
        showToast('Application submitted successfully!');
        if (onSubmitSuccess) onSubmitSuccess(res.application);
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Application submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} title={`Apply: ${job.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-xs text-slate-500">
          Applying to <strong className="text-slate-800">{job.company}</strong> ({job.location})
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Resume / Portfolio Summary
          </label>
          <textarea
            rows={4}
            required
            value={formData.resume}
            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
            placeholder="Paste key experience, tech stack, and project highlights for AI refinement..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* AI Assistant Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleImproveResume}
            disabled={isAiLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 transition border border-purple-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Improve Resume
          </button>
          <button
            type="button"
            onClick={handleGenerateCoverLetter}
            disabled={isAiLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-pink-50 text-pink-700 font-bold text-xs hover:bg-pink-100 transition border border-pink-200"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate Cover Letter
          </button>
        </div>

        {isAiLoading && (
          <div className="flex items-center justify-center py-4 text-purple-600">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}

        {aiHelperText && (
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg text-xs text-slate-700 whitespace-pre-line max-h-48 overflow-y-auto">
            {aiHelperText}
          </div>
        )}

        <div className="pt-2 text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white font-bold rounded-lg text-sm shadow-md transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
