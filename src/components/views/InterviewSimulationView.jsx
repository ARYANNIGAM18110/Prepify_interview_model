import React, { useState } from 'react';
import { Bot, CheckCircle, Square, Mic, Loader2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { useSpeech } from '../../hooks/useSpeech.js';

const TRACK_QUESTIONS = {
  frontend: [
    'Explain the difference between let, const, and var in modern JavaScript.',
    'What are React Hooks and how does the reconciliation loop handle virtual DOM updates?',
    'How would you diagnose and fix poor First Contentful Paint (FCP) and Cumulative Layout Shift (CLS)?',
    'What is prop drilling and what state management patterns prevent it?'
  ],
  backend: [
    'Compare relational SQL databases with NoSQL database architectures in scaling scenarios.',
    'How does HTTP/2 multiplexing improve throughput compared to HTTP/1.1?',
    'Explain how JWT authentication works and how you prevent token hijacking.',
    'What strategies would you use to design a distributed rate limiter?'
  ],
  'data-science': [
    'What is the bias-variance tradeoff and how do regularization techniques address it?',
    'Explain the mathematical difference between precision, recall, and F1 score.',
    'How do you handle severe class imbalance when training binary classifiers?'
  ],
  cloud: [
    'Explain the difference between containers and traditional virtual machines.',
    'What is Infrastructure as Code (IaC) and what problems does it solve?',
    'How do load balancers perform continuous health checks and failovers in multi-region setups?'
  ]
};

export default function InterviewSimulationView({ showToast }) {
  const [interviewTrack, setInterviewTrack] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [interviewReport, setInterviewReport] = useState(null);

  const { isListening, speakText, toggleVoiceRecording } = useSpeech((transcript) => {
    setCurrentAnswer(transcript);
  });

  const startInterview = (track) => {
    setInterviewTrack(track);
    setCurrentQuestionIdx(0);
    setUserAnswers([]);
    setCurrentAnswer('');
    setInterviewReport(null);
    const firstQ = TRACK_QUESTIONS[track][0];
    speakText(firstQ);
  };

  const handleNextQuestion = async () => {
    const questions = TRACK_QUESTIONS[interviewTrack];
    const updatedAnswers = [
      ...userAnswers,
      {
        question: questions[currentQuestionIdx],
        answer: currentAnswer.trim() || 'No audible answer recorded.'
      }
    ];
    setUserAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentQuestionIdx < questions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      speakText(questions[nextIdx]);
    } else {
      setIsAnalyzing(true);
      try {
        const res = await api.evaluateInterview(interviewTrack, updatedAnswers);
        setInterviewReport(res.report);
        speakText('Thank you for completing the technical simulation. Your AI feedback scorecard is ready.');
      } catch (err) {
        showToast(err.message || 'Evaluation generation encountered an issue.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
          <Bot className="w-3.5 h-3.5" />
          AI Voice & Text Interview Simulator
        </div>
        <h1 className="text-3xl font-black text-slate-900">Real-Time Technical Mock Interviews</h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Practice track-specific technical interview questions with speech synthesis and instant personalized feedback from a simulated lead engineer.
        </p>
      </div>

      {!interviewTrack ? (
        /* Track Selection */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 text-center">
            Select Your Interview Specialization
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'frontend', label: 'Frontend', desc: 'React, Virtual DOM, CSS Perf' },
              { id: 'backend', label: 'Backend', desc: 'APIs, Scaling, Microservices' },
              { id: 'data-science', label: 'Data Science', desc: 'ML, Pandas, Bias-Variance' },
              { id: 'cloud', label: 'Cloud & DevOps', desc: 'Docker, IaC, CI/CD' }
            ].map((track) => (
              <button
                key={track.id}
                onClick={() => startInterview(track.id)}
                className="p-5 rounded-2xl border-2 border-slate-100 hover:border-purple-600 hover:bg-purple-50/50 transition flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-900 text-sm">{track.label}</span>
                <span className="text-xs text-slate-400 mt-1">{track.desc}</span>
              </button>
            ))}
          </div>
        </div>
      ) : interviewReport ? (
        /* Report View */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Interview Evaluation Scorecard</h2>
            <p className="text-slate-500 text-xs">Evaluated via technical analysis engine</p>
          </div>

          <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-6 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
            {interviewReport}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => setInterviewTrack(null)}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition"
            >
              Select Another Track
            </button>
          </div>
        </div>
      ) : (
        /* Active Interview Session */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              Track: <strong className="text-purple-600 capitalize">{interviewTrack}</strong>
            </span>
            <span>
              Question {currentQuestionIdx + 1} of {TRACK_QUESTIONS[interviewTrack].length}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-500 h-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIdx + 1) / TRACK_QUESTIONS[interviewTrack].length) * 100}%`
              }}
            />
          </div>

          {/* Prompt Question */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 uppercase">Interviewer Prompt</span>
              <button
                onClick={() => speakText(TRACK_QUESTIONS[interviewTrack][currentQuestionIdx])}
                className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
              >
                <Bot className="w-3.5 h-3.5" /> Replay Audio
              </button>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {TRACK_QUESTIONS[interviewTrack][currentQuestionIdx]}
            </p>
          </div>

          {/* Response Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">Your Technical Response</label>
            <textarea
              rows={5}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your structured explanation here or use the microphone to dictate your response..."
              className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
            />
          </div>

          {/* Microphone & Next Buttons */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={() => toggleVoiceRecording(showToast)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isListening ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              {isListening ? 'Stop Dictating' : 'Voice Input (Speech-to-Text)'}
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={isAnalyzing}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
                </>
              ) : currentQuestionIdx === TRACK_QUESTIONS[interviewTrack].length - 1 ? (
                'Finish & Score Interview'
              ) : (
                'Submit & Next Question'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
