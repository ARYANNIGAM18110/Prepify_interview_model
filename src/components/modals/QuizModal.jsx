import React, { useState, useEffect } from 'react';
import { Award, Clock, Loader2 } from 'lucide-react';
import ModalWrapper from '../common/ModalWrapper.jsx';
import { api } from '../../api/client.js';

export default function QuizModal({ topic, onClose, onBadgeEarned, showToast }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadQuiz() {
      setIsGenerating(true);
      try {
        const res = await api.generateQuiz(topic);
        if (active) setQuestions(res.questions || []);
      } catch (err) {
        if (active) {
          showToast('Failed to generate dynamic quiz.');
          onClose();
        }
      } finally {
        if (active) setIsGenerating(false);
      }
    }
    loadQuiz();
    return () => {
      active = false;
    };
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const passed = correctCount >= Math.ceil(questions.length * 0.5);
    const badgeName = `${topic} Certified Pro`;

    if (passed) {
      try {
        await api.awardBadge(badgeName);
        if (onBadgeEarned) onBadgeEarned(badgeName);
        showToast(`Badge Earned: ${badgeName}!`);
      } catch {
        // Continue even if offline badge save
      }
    }

    setResult({
      score: correctCount,
      total: questions.length,
      passed,
      badgeName
    });
  };

  return (
    <ModalWrapper onClose={onClose} title={`Skill Quiz: ${topic}`}>
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-12 text-purple-600 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Generating questions...</span>
        </div>
      ) : result ? (
        <div className="text-center py-6 space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              result.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {result.passed ? <Award className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h3>
          <p className="text-sm text-slate-600">
            You scored <strong>{result.score} / {result.total}</strong> on the {topic} evaluation.
          </p>
          {result.passed && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold inline-block">
              Badge Added: {result.badgeName}
            </div>
          )}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-800">
                {idx + 1}. {q.question}
              </p>
              <div className="space-y-1.5 pl-2">
                {q.options.map((opt, oIdx) => (
                  <label key={oIdx} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === oIdx}
                      onChange={() => setAnswers({ ...answers, [q.id]: oIdx })}
                      required
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg text-xs hover:opacity-90 transition shadow-sm"
            >
              Submit & Score Quiz
            </button>
          </div>
        </form>
      )}
    </ModalWrapper>
  );
}
