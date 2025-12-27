import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { ShieldCheck, LogOut, LayoutDashboard, ClipboardList } from 'lucide-react';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[Vazirmatn]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg hidden sm:block">ResilienceOS</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <button 
                    onClick={() => navigate('/')} 
                    className="text-gray-600 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">داشبورد</span>
                  </button>
                  <button 
                    onClick={() => navigate('/assessment')} 
                    className="text-gray-600 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span className="hidden sm:inline">ارزیابی جدید</span>
                  </button>
                  <div className="h-6 w-px bg-gray-300 mx-2"></div>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">خروج</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;