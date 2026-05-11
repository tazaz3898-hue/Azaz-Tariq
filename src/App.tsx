import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Learn from './pages/Learn';
import Assistant from './pages/Assistant';
import Community from './pages/Community';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Toaster position="top-center" dir="rtl" expand={true} richColors />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <svg width="150" height="40" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
                  <g id="logo-icon-footer">
                    <path d="M22 18C23.6569 18 25 16.6569 25 15C25 13.3431 23.6569 12 22 12C20.3431 12 19 13.3431 19 15C19 16.6569 20.3431 18 22 18Z" fill="#003366" />
                    <path d="M25 19C22.2386 19 19.5 21.5 18 24C16.5 26.5 17 32 17 32L24 28V32L31 23C31 23 28.5 19 25 19Z" fill="#003366" />
                    <path d="M32 10L33 13L36 14L33 15L32 18L31 15L28 14L31 13L32 10Z" fill="#0066CC" />
                    <rect x="12" y="22" width="4" height="10" rx="2" fill="#FF8000" />
                    <rect x="8" y="25" width="4" height="7" rx="2" fill="#00A0A0" />
                    <path d="M6 35C12 42 25 40 32 30L34 32C25 44 10 44 4 37L6 35Z" fill="#FF6600" />
                  </g>
                  <text x="45" y="32" fill="#003366" style={{ font: 'bold 28px sans-serif' }}>شغلني</text>
                </svg>
              </div>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                منصة ذكية تساعد الشباب اليمني على دخول عالم العمل الحر، تطوير مهاراتهم، والحصول على فرص عمل محلية وعالمية.
              </p>
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} شغلني. صنع بحب لليمن السعيد.
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}
