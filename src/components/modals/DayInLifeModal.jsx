import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ModalWrapper from '../common/ModalWrapper.jsx';
import { api } from '../../api/client.js';

export default function DayInLifeModal({ job, onClose, onApplyDirect }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchSummary() {
      setLoading(true);
      try {
        const res = await api.getDayInLife(job.title, job.company);
        if (active) setText(res.text);
      } catch (err) {
        if (active) setText('Unable to load day-in-the-life profile at this time.');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchSummary();
    return () => {
      active = false;
    };
  }, [job]);

  return (
    <ModalWrapper onClose={onClose} title={`A Day in the Life: ${job.title}`}>
      <div className="space-y-4">
        <div className="text-xs text-slate-500">
          Role preview for <strong className="text-purple-600">{job.company}</strong>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-purple-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
            {text}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onApplyDirect}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg text-xs hover:opacity-90 transition"
          >
            Apply for this Role
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
