import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { ThemeProvider } from './context/ThemeContext';
import RootLayout from './layouts/RootLayout';
import { Skeleton } from './components/ui/skeleton';

// Lazy loading route components (Code Splitting)
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const JobMatch = lazy(() => import('./pages/JobMatch'));
const ShareView = lazy(() => import('./pages/ShareView'));

function LoadingFallback() {
  return (
    <div className="space-y-8 w-full py-12 text-left">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-4 h-72" />
        <Skeleton className="lg:col-span-8 h-72" />
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="job-match" element={<JobMatch />} />
                <Route path="share" element={<ShareView />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ResumeProvider>
    </ThemeProvider>
  );
}
