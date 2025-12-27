import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate('/');
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // Sign Up Logic
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // If email confirmation is enabled in Supabase, session might be null
        if (data.session) {
            navigate('/');
        } else {
            alert('ثبت‌نام موفقیت‌آمیز بود! لطفا ایمیل خود را چک کنید (اگر تایید ایمیل فعال است).');
            setIsSignUp(false); // Switch back to login
        }

      } else {
        // Sign In Logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'خطایی رخ داد. لطفا مجددا تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-[Vazirmatn]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3 mb-6">
            <ShieldCheck className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          {isSignUp ? 'ایجاد حساب کاربری' : 'ورود به ResilienceOS'}
        </h2>
        <p className="text-gray-600 text-sm max-w-xs mx-auto">
          پلتفرم جامع ارزیابی و ارتقای تاب‌آوری سازمانی
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          
          <form className="space-y-6" onSubmit={handleAuth}>
            
            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errorMsg}
                </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                آدرس ایمیل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                رمز عبور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="******"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? 'ثبت‌نام و ورود' : 'ورود به حساب'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isSignUp ? 'حساب کاربری دارید؟' : 'حساب کاربری ندارید؟'}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
               <button
                 type="button"
                 onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg(null);
                 }}
                 className="text-indigo-600 hover:text-indigo-500 font-medium text-sm hover:underline"
               >
                 {isSignUp ? 'ورود به حساب موجود' : 'ایجاد حساب کاربری جدید'}
               </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}