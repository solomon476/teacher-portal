import { useTeacher } from '../../context/TeacherContext';
import { Users, BookOpen, Clock, TrendingUp, Award, Star, Zap, Check, ChevronRight, ArrowUpRight, Download, Loader2, Sparkles, CalendarSync } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function TeacherDashboard() {
  const { teacherData } = useTeacher();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  const handleAnalyzeTimetable = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiRecommendation("AI Suggestion: Your Grade 4 Science class overlaps with peak fatigue hours (2 PM). Consider shifting it to a morning slot for 15% better engagement.");
    }, 2500);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('Report downloaded successfully!');
    }, 2000);
  };

  const stats = [
    { label: 'Total Learners', value: teacherData?.classes?.reduce((acc, c) => acc + c.students.length, 0) || 0, icon: Users, color: 'text-blue-600', trend: '+12%' },
    { label: 'Classes', value: teacherData?.classes?.length || 0, icon: Award, color: 'text-indigo-600', trend: 'Stable' },
    { label: 'Submissions', value: '12', icon: BookOpen, color: 'text-amber-600', trend: '+4 today' },
    { label: 'Attendance Rate', value: '94.2%', icon: Clock, color: 'text-emerald-600', trend: '+0.5%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back, {teacherData?.name}. Here is what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? 'Generating...' : 'Download Report'}
          </button>
          <button 
            onClick={() => navigate('/teacher/classes')}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
          >
            <Users size={16} /> Assess Learners
          </button>
        </div>
      </div>

      {/* Metric Cards - SaaS Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded bg-white border border-slate-100 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-white border border-slate-100 text-slate-600'
              }`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Recent Activity</h2>
              <button 
                onClick={() => alert('Full activity history feature coming soon!')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                View History
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { type: 'Assessment', text: 'Alex Johnson updated to "Exceeding Expectation" in Science', time: '2h ago', icon: Star, color: 'text-amber-500' },
                { type: 'Portfolio', text: 'Sarah Smith submitted a new evidence item for review', time: '4h ago', icon: BookOpen, color: 'text-blue-500' },
                { type: 'Attendance', text: 'Grade 4 Science roll call was completed', time: 'Today', icon: Check, color: 'text-emerald-500' },
                { type: 'Class', text: 'New strand "Sustainable Agriculture" added to Grade 5', time: 'Yesterday', icon: Zap, color: 'text-indigo-500' },
              ].map((activity, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between group hover:bg-white border border-slate-100/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full bg-white border border-slate-100 ${activity.color}`}>
                      <activity.icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{activity.text}</p>
                      <p className="text-xs text-slate-400">{activity.type} • {activity.time}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-slate-900 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-indigo-600" />
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-500">CBC Insights</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Based on recent assessments, your Grade 4 learners are showing significant growth in <span className="text-indigo-600 font-bold">Critical Thinking</span>.
            </p>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <button 
                onClick={() => alert('Generating full analytics report...')}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
              >
                Analytics Report <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-800 rounded-lg p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:bg-purple-400/40 transition-colors" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Sparkles size={18} className="text-purple-300" />
              <h3 className="font-bold text-sm uppercase tracking-widest text-indigo-200">AI Timetable Analyst</h3>
            </div>
            
            {aiRecommendation ? (
              <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-indigo-100 text-sm leading-relaxed font-medium">
                  {aiRecommendation}
                </p>
                <button 
                  onClick={() => setAiRecommendation(null)}
                  className="text-xs font-bold text-purple-300 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <div className="relative z-10 space-y-4">
                <p className="text-indigo-200/80 text-sm leading-relaxed">
                  Let AI analyze your current class schedule to find optimal learning periods and reduce burnout.
                </p>
                <button 
                  onClick={handleAnalyzeTimetable}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <><Loader2 size={16} className="animate-spin" /> Analyzing Schedule...</>
                  ) : (
                    <><CalendarSync size={16} /> Generate Recommendation</>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 h-full">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/teacher/classes')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded transition-colors"
              >
                Mark Attendance
              </button>
              <button 
                onClick={() => navigate('/teacher/portfolio')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded transition-colors"
              >
                New Portfolio Entry
              </button>
              <button 
                onClick={() => alert('Meeting scheduler feature coming soon!')}
                className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded transition-colors"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
