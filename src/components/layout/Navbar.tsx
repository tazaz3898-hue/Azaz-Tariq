import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Briefcase, GraduationCap, MessageSquare, Bot, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile, logout, loginWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'فرص العمل', path: '/jobs', icon: Briefcase },
    { name: 'تعلم العمل الحر', path: '/learn', icon: GraduationCap },
    { name: 'المساعد الذكي', path: '/assistant', icon: Bot },
    { name: 'المجتمع', path: '/community', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center">
                <svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
                  {/* Logo Icon Part */}
                  <g id="logo-icon">
                    {/* The person figure */}
                    <path d="M22 18C23.6569 18 25 16.6569 25 15C25 13.3431 23.6569 12 22 12C20.3431 12 19 13.3431 19 15C19 16.6569 20.3431 18 22 18Z" fill="#003366" />
                    <path d="M25 19C22.2386 19 19.5 21.5 18 24C16.5 26.5 17 32 17 32L24 28V32L31 23C31 23 28.5 19 25 19Z" fill="#003366" />
                    {/* The star */}
                    <path d="M32 10L33 13L36 14L33 15L32 18L31 15L28 14L31 13L32 10Z" fill="#0066CC" />
                    {/* The bars */}
                    <rect x="12" y="22" width="4" height="10" rx="2" fill="#FF8000" />
                    <rect x="8" y="25" width="4" height="7" rx="2" fill="#00A0A0" />
                    {/* The bottom orange curve */}
                    <path d="M6 35C12 42 25 40 32 30L34 32C25 44 10 44 4 37L6 35Z" fill="#FF6600" />
                  </g>
                  {/* Logo Text Part */}
                  <text x="45" y="32" fill="#003366" style={{ font: 'bold 28px sans-serif' }}>شغلني</text>
                  <text x="45" y="44" fill="#666" style={{ font: '10px sans-serif' }}>فرصتك للعمل الحر.. تبدأ من هنا</text>
                </svg>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium",
                  location.pathname === item.path && "text-primary"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-1.5 text-gray-400" />
                    )}
                  </div>
                  <span className="font-medium text-sm">{profile?.name}</span>
                </Link>
                <button onClick={() => logout()} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithGoogle()}
                className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md shadow-primary/20"
              >
                دخول / تسجيل
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 text-gray-600 hover:text-primary transition-colors p-2 rounded-lg",
                    location.pathname === item.path && "bg-gray-50 text-primary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-lg">{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-gray-700 p-2"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">الملف الشخصي</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 text-red-500 p-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">تسجيل الخروج</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      loginWithGoogle();
                      setIsOpen(false);
                    }}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold"
                  >
                    دخول / تسجيل
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
