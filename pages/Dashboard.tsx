import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, History, Building2, Trash2, User } from 'lucide-react';
import { SCORING_RESULTS } from '../constants';

interface AssessmentRecord {
  id: number;
  created_at: string;
  score: number;
  organization_name: string;
}

export default function Dashboard() {
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserEmail(user.email || '');

      const { data, error } = await supabase
        .from('assessments')
        .select('id, created_at, score, organization_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering any parent click events
    if (!window.confirm('آیا از حذف این ارزیابی اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) return;

    try {
      const { error } = await supabase.from('assessments').delete().eq('id', id);
      if (error) throw error;
      // Optimistically remove from UI
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      alert('خطا در حذف آیتم');
      console.error(error);
    }
  };

  // Format data for chart
  const chartData = history.map(h => ({
    date: new Date(h.created_at).toLocaleDateString('fa-IR'),
    score: h.score,
    org: h.organization_name
  }));

  const latestScore = history.length > 0 ? history[history.length - 1].score : 0;
  const latestResult = SCORING_RESULTS.find(r => latestScore >= r.min && latestScore <= r.max);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 gap-2">
    <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
    در حال بارگذاری اطلاعات...
  </div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">داشبورد تاب‌آوری</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
             <User className="w-4 h-4" />
             <span>{userEmail}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/assessment')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          شروع ارزیابی جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPI Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">کل ارزیابی‌ها</p>
              <h3 className="text-2xl font-bold text-gray-900">{history.length}</h3>
            </div>
          </div>
        </div>

        {/* KPI Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">آخرین امتیاز</p>
              <h3 className="text-2xl font-bold text-gray-900 flex items-baseline gap-2">
                {latestScore}
                <span className="text-xs text-gray-400 font-normal">/ 200</span>
              </h3>
            </div>
          </div>
        </div>

        {/* KPI Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">وضعیت فعلی</p>
              <h3 className={`text-lg font-bold ${latestResult?.color === 'green' ? 'text-green-600' : latestResult?.color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>
                {history.length > 0 ? latestResult?.title.split(' ')[0] + '...' : '---'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">روند رشد تاب‌آوری</h3>
          <div className="h-[300px] w-full">
            {history.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 200]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <TrendingUp className="w-10 h-10 mb-2 opacity-50" />
                <p>برای مشاهده نمودار، حداقل ۲ ارزیابی ثبت کنید</p>
              </div>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تاریخچه ارزیابی‌ها</h3>
          <div className="space-y-3 overflow-y-auto pr-2 flex-1 max-h-[400px]">
            {history.slice().reverse().map((record) => (
              <div key={record.id} className="group flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50 transition-all">
                <div>
                  <div className="font-bold text-gray-800 text-sm">{record.organization_name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(record.created_at).toLocaleDateString('fa-IR')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`font-bold px-2.5 py-1 rounded-lg text-xs ${record.score > 140 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {record.score}
                    </span>
                    <button 
                      onClick={(e) => handleDelete(record.id, e)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">هنوز ارزیابی ثبت نشده است</p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  اولین ارزیابی خود را شروع کنید
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}