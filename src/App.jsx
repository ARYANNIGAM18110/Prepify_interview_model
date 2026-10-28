import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Toast from './components/common/Toast.jsx';

import HomeView from './components/views/HomeView.jsx';
import InternshipsView from './components/views/InternshipsView.jsx';
import DashboardView from './components/views/DashboardView.jsx';
import LearningHubView from './components/views/LearningHubView.jsx';
import InterviewSimulationView from './components/views/InterviewSimulationView.jsx';
import CompanyGatewayView from './components/views/CompanyGatewayView.jsx';

import AuthModal from './components/modals/AuthModal.jsx';
import ApplyModal from './components/modals/ApplyModal.jsx';
import DayInLifeModal from './components/modals/DayInLifeModal.jsx';
import QuizModal from './components/modals/QuizModal.jsx';

import { useAuth } from './context/AuthContext.jsx';
import { api } from './api/client.js';

export default function App() {
  const { currentUser } = useAuth();

  // Navigation & Global Filters
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortFilter, setSortFilter] = useState('popular');

  // Backend Synchronized States
  const [internships, setInternships] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Active Modals & Selected Target
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'signup' | 'apply' | 'dayInLife' | 'quiz' | null
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedQuizTopic, setSelectedQuizTopic] = useState(null);

  // Notifications
  const [notification, setNotification] = useState('');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Fetch initial data from backend API
  const refreshData = async () => {
    setIsLoadingJobs(true);
    try {
      const [jobsRes, dashRes] = await Promise.all([
        api.getInternships(searchQuery, sortFilter),
        api.getDashboardData()
      ]);
      setInternships(jobsRes.internships || []);
      if (dashRes.data) {
        setSavedIds(dashRes.data.savedIds || []);
        setApplications(dashRes.data.applications || []);
        setBadges(dashRes.data.badges || []);
      }
    } catch (err) {
      console.warn('Backend sync note:', err.message);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Client-side quick filter & sort (matching backend logic)
  const filteredInternships = useMemo(() => {
    let list = [...internships];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          (item.skills && item.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    if (sortFilter === 'rated') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortFilter === 'newest') {
      list.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else {
      const ppoWeight = { High: 3, Medium: 2, Low: 1 };
      list.sort(
        (a, b) =>
          (ppoWeight[b.ppoChance] || 1) * b.rating -
          (ppoWeight[a.ppoChance] || 1) * a.rating
      );
    }
    return list;
  }, [internships, searchQuery, sortFilter]);

  // Handlers
  const handleToggleSave = async (jobId) => {
    if (!currentUser) {
      showToast('Please log in to save internships.');
      setActiveModal('login');
      return;
    }
    try {
      const res = await api.toggleSaveInternship(jobId);
      setSavedIds(res.savedIds);
      showToast(res.saved ? 'Saved to your dashboard!' : 'Removed from saved internships.');
    } catch (err) {
      showToast(err.message || 'Failed to update bookmark.');
    }
  };

  const handleOpenApply = (job) => {
    setSelectedJob(job);
    setActiveModal('apply');
  };

  const handleOpenDayInLife = (job) => {
    setSelectedJob(job);
    setActiveModal('dayInLife');
  };

  const handleOpenQuiz = (topic) => {
    setSelectedQuizTopic(topic);
    setActiveModal('quiz');
  };

  const handleApplicationSuccess = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleBadgeEarned = (newBadge) => {
    setBadges((prev) => (prev.includes(newBadge) ? prev : [...prev, newBadge]));
  };

  const handlePostSuccess = (newJob) => {
    setInternships((prev) => [newJob, ...prev]);
    setActiveTab('internships');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Toast message={notification} />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenLogin={() => setActiveModal('login')}
        onOpenSignup={() => setActiveModal('signup')}
        onShowToast={showToast}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {activeTab === 'home' && (
          <HomeView
            internships={filteredInternships}
            savedIds={savedIds}
            isLoading={isLoadingJobs}
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
            onNavigate={setActiveTab}
            onSave={handleToggleSave}
            onApply={handleOpenApply}
            onDayInLife={handleOpenDayInLife}
          />
        )}

        {activeTab === 'internships' && (
          <InternshipsView
            internships={filteredInternships}
            savedIds={savedIds}
            sortFilter={sortFilter}
            setSortFilter={setSortFilter}
            onSave={handleToggleSave}
            onApply={handleOpenApply}
            onDayInLife={handleOpenDayInLife}
          />
        )}

        {activeTab === 'dashboard' && currentUser && (
          <DashboardView
            internships={internships}
            savedIds={savedIds}
            applications={applications}
            badges={badges}
            onSaveToggle={handleToggleSave}
            onApplyDirect={handleOpenApply}
          />
        )}

        {activeTab === 'learning' && (
          <LearningHubView onOpenQuiz={handleOpenQuiz} showToast={showToast} />
        )}

        {activeTab === 'interview' && (
          <InterviewSimulationView showToast={showToast} />
        )}

        {activeTab === 'company' && (
          <CompanyGatewayView onPostSuccess={handlePostSuccess} showToast={showToast} />
        )}
      </main>

      <Footer onNavigate={setActiveTab} />

      {/* Modals */}
      {(activeModal === 'login' || activeModal === 'signup') && (
        <AuthModal
          initialMode={activeModal}
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
          showToast={showToast}
        />
      )}

      {activeModal === 'apply' && selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setActiveModal(null)}
          onSubmitSuccess={handleApplicationSuccess}
          showToast={showToast}
          onOpenLogin={() => setActiveModal('login')}
        />
      )}

      {activeModal === 'dayInLife' && selectedJob && (
        <DayInLifeModal
          job={selectedJob}
          onClose={() => setActiveModal(null)}
          onApplyDirect={() => setActiveModal('apply')}
        />
      )}

      {activeModal === 'quiz' && selectedQuizTopic && (
        <QuizModal
          topic={selectedQuizTopic}
          onClose={() => setActiveModal(null)}
          onBadgeEarned={handleBadgeEarned}
          showToast={showToast}
        />
      )}
    </div>
  );
}
