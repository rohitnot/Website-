import { useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import ChapterReader from './components/sections/ChapterReader';

import { buildChapters } from './data/chapters';
import Sidebar from './components/Sidebar';
import SiteHeader from './components/SiteHeader';
import HeroSection from './components/sections/HeroSection';
import AdminLogin from './components/sections/AdminLogin';
import RecentUpload from './components/sections/RecentUpload';
import ReadingPage from './components/sections/ReadingPage';
import Footer from './components/Footer';
import ThemeToggle from './components/ui/ThemeToggle';
import FabPlay from './components/ui/FabPlay';
import CommentsSheet from './components/modals/CommentsSheet';
import RatingModal from './components/modals/RatingModal';
import ComingSoonModal from './components/modals/ComingSoonModal';
import Dashboard from './components/sections/Dashboard';
import HelpCenter from './components/sections/HelpCenter';
import About from './components/sections/About';
import Contact from './components/sections/Contact';
import LatestUpdates from './components/sections/LatestUpdates';
import ImageShowcase from './components/sections/ImageShowcase';

export default function App() {


  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activePage, setActivePage] = useState('index');
  const [activeStoryId, setActiveStoryId] = useState(null);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [isReversed, setIsReversed] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [displayRating, setDisplayRating] = useState('4.9');
  const [currentRating, setCurrentRating] = useState(0);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState('Ch. 1');
  const [commentInput, setCommentInput] = useState('');
  const [commentName, setCommentName] = useState(''); // New state for name
  const [commentsByChapter, setCommentsByChapter] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);


  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const savedRating = localStorage.getItem('storyRating');
    if (savedRating) setDisplayRating(savedRating);
    const savedState = localStorage.getItem('isSaved');
    if (savedState === 'true') setIsSaved(true);

    // Check admin status
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') setIsAdmin(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('isSaved', isSaved ? 'true' : 'false');
  }, [isSaved]);

  const chapters = useMemo(() => {
    const base = buildChapters();
    return isReversed ? [...base].reverse() : base;
  }, [isReversed]);

  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash.split('?')[0] || '#index';
      let pageId = hash.replace('#', '') || 'index';

      if (pageId.startsWith('admin-chapters/') || pageId === 'admin-chapters') {
        pageId = 'dashboard';
      } else if (pageId.startsWith('reading/')) {
        const storyId = pageId.split('/')[1];
        setActiveStoryId(storyId);
        pageId = 'reading';
      } else if (pageId === 'reading') {
        setActiveStoryId(null);
        // Fallback logic could go here if needed
      } else if (pageId.startsWith('read-chapter/')) {
        const chapterId = pageId.split('/')[1];
        setActiveChapterId(chapterId);
        pageId = 'chapter-reader';
      }

      setActivePage(pageId);
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  useEffect(() => {
    if (activePage !== 'index') return;

    const ctx = gsap.context(() => {
      const heroTitle = gsap.utils.toArray('.hero-title');
      const heroSub = gsap.utils.toArray('.hero-sub');
      const heroCta = gsap.utils.toArray('.hero-cta');
      const cards = gsap.utils.toArray('.card-animate');

      if (heroTitle.length) {
        gsap.from(heroTitle, { y: 18, opacity: 0, duration: 0.8, ease: 'power2.out' });
      }
      if (heroSub.length) {
        gsap.from(heroSub, { y: 14, opacity: 0, duration: 0.8, delay: 0.1, ease: 'power2.out' });
      }
      if (heroCta.length) {
        gsap.from(heroCta, { y: 12, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power2.out', stagger: 0.1 });
      }
      if (cards.length) {
        gsap.from(cards, { y: 18, opacity: 0, duration: 0.7, delay: 0.25, ease: 'power2.out', stagger: 0.15 });
      }
    });

    return () => ctx.revert();
  }, [activePage]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleNav = () => setIsNavOpen((prev) => !prev);
  const handleSaveToggle = () => setIsSaved((prev) => !prev);

  const openComments = (chapter) => {
    setActiveChapter(chapter);
    setIsCommentsOpen(true);
  };

  const closeComments = () => {
    setIsCommentsOpen(false);
    setCommentInput('');
    setCommentName(''); // Clear name on close
  };

  const postComment = () => {
    const text = commentInput.trim();
    const name = commentName.trim() || 'Anonymous';
    if (!text) return;

    setCommentsByChapter((prev) => {
      const next = { ...prev };
      const newComment = { name, text, date: new Date().toISOString() };
      next[activeChapter] = [...(next[activeChapter] || []), newComment];
      return next;
    });
    setCommentInput('');
  };

  const submitRating = () => {
    if (currentRating === 0) {
      alert('Select stars first!');
      return;
    }
    const rating = `${currentRating}.0`;
    localStorage.setItem('storyRating', rating);
    setDisplayRating(rating);
    setIsRatingOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
    window.location.hash = '#dashboard';
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    window.location.hash = '#index';
  };

  return (
    <div className="min-h-screen bg-premium-cream text-premium-charcoal dark:bg-zinc-950 dark:text-zinc-100">
      <Sidebar isOpen={isNavOpen} onClose={toggleNav} />
      <SiteHeader onToggleNav={toggleNav} />

      {activePage === 'index' && (
        <main>
          <HeroSection isDark={isDark} />
          <RecentUpload />
          <ImageShowcase />
        </main>
      )}

      {activePage === 'reading' && (
        <ReadingPage
          storyId={activeStoryId}
          dummyChapters={chapters}
          displayRating={displayRating}
          isSaved={isSaved}
          onOpenRating={() => setIsRatingOpen(true)}
          onToggleSave={handleSaveToggle}
          onSortToggle={() => setIsReversed((prev) => !prev)}
          onOpenComments={openComments}
          onBack={() => (window.location.hash = '#index')}
          isReversed={isReversed}
        />
      )}

      {activePage === 'chapter-reader' && (
        <ChapterReader
          chapterId={activeChapterId}
          onBack={() => window.history.back()}
        />
      )}

      {activePage === 'admin' && (
        <AdminLogin
          apiBaseUrl={apiBaseUrl}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {activePage === 'dashboard' && isAdmin && <Dashboard />}

      {activePage === 'help' && <HelpCenter />}
      {activePage === 'about' && <About />}
      {activePage === 'contact' && <Contact />}
      {activePage === 'latest' && <LatestUpdates />}

      <Footer isAdmin={isAdmin} onLogout={handleLogout} />
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      <FabPlay onClick={() => (window.location.hash = '#reading')} />

      <CommentsSheet
        isOpen={isCommentsOpen}
        activeChapter={activeChapter}
        comments={commentsByChapter[activeChapter]}
        inputValue={commentInput}
        onInputChange={(event) => setCommentInput(event.target.value)}
        nameValue={commentName}
        onNameChange={(event) => setCommentName(event.target.value)}
        onSubmit={postComment}
        onClose={closeComments}
      />

      <RatingModal
        isOpen={isRatingOpen}
        currentRating={currentRating}
        onSetRating={setCurrentRating}
        onSubmit={submitRating}
      />

      <ComingSoonModal isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} />
    </div>
  );
}
