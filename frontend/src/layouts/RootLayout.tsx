import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { useTheme } from '../context/ThemeContext';
import AIChatPanel from '../components/AIChatPanel';
import { 
  LayoutDashboard, 
  Briefcase, 
  Cpu, 
  ChevronLeft, 
  Menu, 
  Trash2, 
  Edit3, 
  Layers, 
  Sun, 
  Moon, 
  MessageSquare,
  Calendar,
  LogOut,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function RootLayout() {
  const { 
    uploadedFile, 
    history, 
    activeResumeId, 
    switchResume, 
    deleteResume, 
    renameResume, 
    clearState 
  } = useResume();
  const { theme, toggleTheme } = useTheme();
  
  const location = useLocation();
  const navigate = useNavigate();
  const isAppView = location.pathname === '/dashboard' || location.pathname === '/job-match';
  
  // Navigation toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  // Media query states to prevent exit animation locks on hidden elements
  const [isMobile, setIsMobile] = useState(false); // md breakpoint (< 768px)
  const [isTablet, setIsTablet] = useState(false); // lg breakpoint (< 1024px)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu and assistant when isAppView becomes false (navigating away)
  useEffect(() => {
    if (!isAppView) {
      setIsAssistantOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, [isAppView]);

  // Simple body overflow handling for AI assistant drawer
  useEffect(() => {
    if (isAssistantOpen) {
      document.body.style.overflow = 'hidden';
      console.log(`[DEBUG] isAssistantOpen is true: set document.body.style.overflow to 'hidden'. Pathname: ${location.pathname}`);
    } else {
      document.body.style.overflow = '';
      console.log(`[DEBUG] isAssistantOpen is false: restored document.body.style.overflow to ''. Pathname: ${location.pathname}`);
    }
    return () => {
      document.body.style.overflow = '';
      console.log(`[DEBUG] cleanup: restored document.body.style.overflow to ''. Pathname: ${location.pathname}`);
    };
  }, [isAssistantOpen, location.pathname]);

  // Escape key event listener to close drawers globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
        if (isAssistantOpen) {
          setIsAssistantOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, isAssistantOpen]);
  
  // Rename state
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleReset = () => {
    clearState();
    navigate('/');
  };

  const handleRenameSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (renameValue.trim()) {
      renameResume(id, renameValue.trim());
    }
    setRenameId(null);
    setRenameValue('');
  };

  const startRename = (id: string, currentName: string) => {
    setRenameId(id);
    setRenameValue(currentName);
  };

  // Nav links definitions
  const links = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/job-match', label: 'Job Alignment', icon: Briefcase },
  ];

  return (
    <div className={`min-h-screen flex relative ${
      isAppView ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'
    } transition-colors duration-350 ${
      theme === 'dark' ? 'bg-[#09090b] text-[#f4f4f5]' : 'bg-[#FAFAFA] text-[#09090B]'
    }`}>
      {/* Background dot grids */}
      <div className={`absolute inset-0 bg-dot-grid pointer-events-none -z-10 ${
        theme === 'dark' ? 'opacity-100' : 'opacity-40'
      }`} />

      {/* Ambient background glows */}
      {theme === 'dark' ? (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-950/5 rounded-full blur-[150px] pointer-events-none -z-10" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-zinc-800/10 rounded-full blur-[150px] pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[150px] pointer-events-none -z-10" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-zinc-100/40 rounded-full blur-[150px] pointer-events-none -z-10" />
        </>
      )}

      {/* Dynamic Navigation Structure */}
      {isAppView ? (
        // App View Sidebar Navigation (Linear/Arc style)
        <div className="flex w-full min-h-screen relative">
          
          {/* Sidebar Drawer on Mobile / Fixed on Desktop */}
          <motion.aside
            initial={{ width: 240 }}
            animate={{ width: isSidebarOpen ? 240 : 64 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`hidden md:flex flex-col border-r shrink-0 relative z-30 ${
              theme === 'dark' ? 'border-zinc-850 bg-[#09090b]/40 backdrop-blur-md' : 'border-zinc-200 bg-[#FFFFFF] shadow-sm'
            }`}
          >
            {/* Branding Header */}
            <div className={`h-14 flex items-center justify-between px-4 border-b ${
              theme === 'dark' ? 'border-zinc-900' : 'border-zinc-200'
            }`}>
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                  theme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-zinc-100' : 'bg-[#F4F4F5] border border-zinc-200 text-[#09090B]'
                }`}>
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
                {isSidebarOpen && (
                  <span className="font-semibold text-xs tracking-wider uppercase text-purple-400 truncate">
                    Workspace
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                  theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200'
                }`}
                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Sidebar Body */}
            <div className="flex-1 py-4 px-3 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                
                {/* Primary Nav Links */}
                <nav className="space-y-1">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs tracking-wide uppercase transition-all duration-200 group ${
                            isActive
                              ? theme === 'dark' ? 'text-zinc-100 bg-zinc-900 font-medium' : 'text-[#09090B] bg-[#F4F4F5] font-semibold border border-zinc-200'
                              : theme === 'dark' ? 'text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/40' : 'text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]/60'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
                        {isSidebarOpen && <span>{link.label}</span>}
                      </NavLink>
                    );
                  })}
                </nav>

                {/* ChatGPT-style Resume History */}
                {isSidebarOpen && (
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-3">
                      Resume History
                    </span>
                    <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className={`group flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                            activeResumeId === item.id
                              ? theme === 'dark' ? 'bg-zinc-900/60 text-zinc-100 border border-zinc-850' : 'bg-[#F4F4F5] text-[#09090B] border border-zinc-200 shadow-sm'
                              : theme === 'dark' ? 'text-zinc-450 hover:bg-zinc-900/20' : 'text-[#71717A] hover:bg-[#F4F4F5]/60 hover:text-[#09090B]'
                          }`}
                        >
                          {renameId === item.id ? (
                            <form
                              onSubmit={(e) => handleRenameSubmit(e, item.id)}
                              className="w-full flex items-center"
                            >
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={(e) => handleRenameSubmit(e, item.id)}
                                autoFocus
                                className={`w-full border rounded px-1.5 py-0.5 text-xs focus:outline-none ${
                                  theme === 'dark' ? 'bg-zinc-950/80 border border-zinc-800 text-zinc-250' : 'bg-white border-zinc-300 text-[#09090B]'
                                }`}
                              />
                            </form>
                          ) : (
                            <div
                              onClick={() => switchResume(item.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  switchResume(item.id);
                                }
                              }}
                              tabIndex={0}
                              role="button"
                              aria-label={`Select resume ${item.filename}`}
                              className="flex-1 min-w-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 rounded px-1"
                            >
                              <span className="text-xs truncate block font-medium">
                                {item.filename}
                              </span>
                              <span className="text-[9px] text-zinc-500 font-light flex items-center gap-1 mt-0.5">
                                <Calendar className="w-2.5 h-2.5" />
                                {item.uploadDate}
                              </span>
                            </div>
                          )}

                          {renameId !== item.id && (
                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                              <button
                                onClick={() => startRename(item.id, item.filename)}
                                className="text-zinc-500 hover:text-zinc-350 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
                                title="Rename"
                                aria-label={`Rename resume ${item.filename}`}
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteResume(item.id)}
                                className="text-zinc-500 hover:text-rose-400 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
                                title="Delete"
                                aria-label={`Delete resume ${item.filename}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {history.length === 0 && (
                        <span className="text-[11px] text-zinc-500 font-light block px-3">
                          No saved uploads yet.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="space-y-4">
                {/* Theme Switcher in Sidebar */}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs w-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                    theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40' : 'text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]/60'
                  }`}
                  aria-label="Toggle dark/light theme"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-zinc-400" />
                      {isSidebarOpen && <span>Light Mode</span>}
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-zinc-550" />
                      {isSidebarOpen && <span>Dark Mode</span>}
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs w-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                    theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40' : 'text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]/60'
                  }`}
                  aria-label="Exit current workspace and return to home"
                >
                  <LogOut className="w-4 h-4 text-zinc-550" />
                  {isSidebarOpen && <span>Exit Workspace</span>}
                </button>
              </div>
            </div>
          </motion.aside>

            {/* Mobile menu backdrop with exit animation tracking */}
            <AnimatePresence mode="wait">
              {isMobileMenuOpen && isMobile && (
                <motion.div
                  key="mobile-menu-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, pointerEvents: 'none' }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-40 pointer-events-auto"
                />
              )}
            </AnimatePresence>

            {/* Mobile Drawer (Framer Motion slide-in) with exit animation tracking */}
            <AnimatePresence mode="wait">
              {isMobileMenuOpen && isMobile && (
                <motion.div
                  key="mobile-nav-drawer"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%', pointerEvents: 'none' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className={`fixed inset-y-0 left-0 w-64 border-r z-50 flex flex-col p-4 ${
                    theme === 'dark' ? 'bg-[#09090b] border-zinc-850' : 'bg-[#FFFFFF] border-zinc-200'
                  }`}
                >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold text-xs tracking-wider uppercase">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1 mb-6">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs uppercase tracking-wide transition-all ${
                            isActive
                              ? theme === 'dark' ? 'text-zinc-100 bg-zinc-900' : 'text-[#09090B] bg-[#F4F4F5] font-semibold border border-zinc-200'
                              : theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900/20' : 'text-[#71717A] hover:bg-[#F4F4F5]/60 hover:text-[#09090B]'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                {/* History inside Mobile Drawer */}
                <div className="space-y-3 flex-1 overflow-y-auto mb-6">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-3">
                    Resume History
                  </span>
                  <div className="space-y-1">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          switchResume(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded-lg text-left cursor-pointer transition-all ${
                          activeResumeId === item.id
                            ? theme === 'dark' ? 'bg-zinc-900 text-zinc-100' : 'bg-[#F4F4F5] text-[#09090B] border border-zinc-200'
                            : theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-900/20' : 'text-[#71717A] hover:bg-[#F4F4F5]/60 hover:text-[#09090B]'
                        }`}
                      >
                        <span className="text-xs truncate block font-medium">{item.filename}</span>
                        <span className="text-[9px] text-zinc-500 block mt-0.5">{item.uploadDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t border-zinc-900 pt-4">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs w-full"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>Toggle Theme</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs w-full text-rose-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Exit Workspace</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

            {/* Main workspace container */}
            <div className="flex-1 flex min-w-0 relative">
              
              {/* Central workspace content area */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Top workspace bar */}
                <header className={`h-14 border-b flex items-center justify-between px-4 sm:px-6 md:px-8 backdrop-blur-md z-20 ${
                  theme === 'dark' ? 'border-zinc-900 bg-[#09090b]/10' : 'border-zinc-200 bg-[#FFFFFF]/60'
                }`}>
                  <div className="flex items-center gap-4">
                    {/* Mobile menu toggle */}
                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      className={`md:hidden p-1.5 rounded-lg border text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                        theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-300 bg-zinc-100'
                      }`}
                      aria-label="Open mobile navigation menu"
                    >
                      <Menu className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
                      <NavLink to="/" className="hover:text-zinc-300 transition-colors">Home</NavLink>
                      <span>/</span>
                      <span className={theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'}>
                        {location.pathname.replace('/', '').replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* AI Assistant toggle */}
                    <button
                      onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                      className={`inline-flex items-center gap-2 rounded-xl text-xs font-semibold h-9 px-4 transition-all border shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                        isAssistantOpen 
                          ? theme === 'dark' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200'
                          : theme === 'dark' ? 'border-zinc-850 bg-zinc-900 text-zinc-300 hover:text-white' : 'border-zinc-200 bg-white text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]'
                      }`}
                      aria-label="Toggle AI Assistant sidebar panel"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">AI Assistant</span>
                    </button>

                    <NavLink
                      to="/"
                      className={`text-xs font-medium py-1.5 px-3 rounded-lg border shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                        theme === 'dark' ? 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800' : 'border-zinc-200 bg-white text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]'
                      }`}
                      aria-label="Go to landing page"
                    >
                      Landing
                    </NavLink>
                  </div>
                </header>

                {/* Content area */}
                <main className={`flex-1 px-4 sm:px-6 md:px-8 py-8 max-w-[1400px] w-full mx-auto ${
                  (isAssistantOpen && isTablet) || (isMobileMenuOpen && isMobile)
                    ? 'overflow-hidden'
                    : 'overflow-y-auto'
                }`}>
                  <Outlet />
                </main>
              </div>

              {/* Assistant Backdrop with exit animation tracking */}
              <AnimatePresence mode="wait">
                {isAssistantOpen && isTablet && (
                  <motion.div
                    key="assistant-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, pointerEvents: 'none' }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsAssistantOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-40 pointer-events-auto"
                  />
                )}
              </AnimatePresence>

              {/* Right Side: AI Chat Assistant Drawer (Desktop & Mobile) with responsive transitions */}
              <AnimatePresence mode="wait">
                {isAssistantOpen && (
                  <motion.aside
                    key="assistant-aside"
                    initial={isTablet ? { x: '100%', opacity: 0 } : { width: 0, opacity: 0 }}
                    animate={isTablet ? { x: 0, opacity: 1 } : { width: 320, opacity: 1 }}
                    exit={isTablet ? { x: '100%', opacity: 0, pointerEvents: 'none' } : { width: 0, opacity: 0, pointerEvents: 'none' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`fixed inset-y-0 right-0 z-50 w-80 flex flex-col border-l shadow-2xl lg:shadow-none lg:static lg:z-30 lg:h-screen lg:sticky lg:top-0 overflow-hidden ${
                      theme === 'dark' 
                        ? 'border-zinc-900 bg-[#09090b] lg:bg-[#09090b]/10 lg:backdrop-blur-md' 
                        : 'border-zinc-200 bg-[#FFFFFF] lg:bg-[#FFFFFF]/60 lg:backdrop-blur-md shadow-sm'
                    }`}
                  >
                    <AIChatPanel onClose={() => setIsAssistantOpen(false)} />
                  </motion.aside>
                )}
              </AnimatePresence>

            </div>
          </div>
      ) : (
        // Landing Page Header Navigation
        <div className="flex-1 flex flex-col min-w-0">
          <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${
            theme === 'dark' ? 'border-zinc-900/50 bg-[#09090b]/40' : 'border-zinc-200 bg-[#FAFAFA]/60'
          }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg border text-purple-400 ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-200 border-zinc-300'
                }`}>
                  <Layers className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm tracking-tight">
                  ResumeIntellect
                </span>
              </div>

              <nav className="flex items-center gap-6">
                <button
                  onClick={toggleTheme}
                  className={`p-1.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 ${
                    theme === 'dark' ? 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200' : 'border-zinc-300 bg-zinc-200/40 text-zinc-655 hover:text-zinc-800'
                  }`}
                  title="Toggle Theme"
                  aria-label="Toggle dark/light theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                
                {uploadedFile ? (
                  <NavLink
                    to="/dashboard"
                    className="text-xs font-semibold bg-zinc-900 text-zinc-100 hover:bg-zinc-855 border border-zinc-800 transition-all py-1.5 px-3 rounded-lg shadow-sm dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:border-transparent"
                  >
                    Go to Workspace
                  </NavLink>
                ) : (
                  <a
                    href="#upload-zone"
                    className="text-xs font-semibold bg-zinc-900 text-zinc-100 hover:bg-zinc-850 border border-zinc-800 transition-all py-1.5 px-3 rounded-lg shadow-sm dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:border-transparent"
                  >
                    Start Analyzer
                  </a>
                )}
              </nav>
            </div>
          </header>

          <main className="flex-grow">
            <Outlet />
          </main>

          <footer className={`border-t py-12 mt-12 ${
            theme === 'dark' ? 'border-zinc-900 bg-zinc-950/20 text-zinc-500' : 'border-zinc-200 bg-[#FAFAFA] text-[#71717A]'
          }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-400 dark:text-zinc-600">ResumeIntellect</span>
                <span>—</span>
                <span>Automated resume optimization.</span>
              </div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-zinc-300 transition-colors">Github</a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
