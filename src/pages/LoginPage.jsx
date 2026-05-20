import { useState } from 'react';
import { useTeacher } from '../context/TeacherContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ArrowRight, ShieldCheck, BookOpen, Clock, Mail, Lock } from 'lucide-react';
import SomoBloomLogo from '../components/SomoBloomLogo';

export default function LoginPage() {
  const { login: teacherLogin } = useTeacher();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoggingIn(true);
    setError('');
    
    try {
      await teacherLogin(formData.email, formData.password);
      navigate('/teacher');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden text-slate-900">

      {/* Animated background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-3 bg-white border border-slate-200 rounded-3xl shadow-2xl mb-6 shadow-indigo-500/10 rotate-3">
            <SomoBloomLogo size={64} showText={false} />
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">Teacher <span className="text-indigo-600">Portal</span></h1>
          <p className="text-slate-500 text-lg font-medium">The Command Center for Educators</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(79,70,229,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900">Teacher Login</h2>
              <p className="text-slate-500 text-sm">Access your workspace</p>
              
              <div 
                onClick={() => setFormData({ email: 'teacher@somobloom.com', password: 'demo' })}
                className="mt-3 px-3 py-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/70 text-indigo-700 font-semibold rounded-2xl inline-flex items-center gap-1.5 text-xs cursor-pointer transition-all active:scale-95"
              >
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" />
                <span>Quick-fill Demo Credentials</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2 px-1">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@school.edu"
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2 px-1">
                  <Lock size={14} /> Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-200 bg-white text-indigo-600 focus:ring-indigo-500/50" />
                <span className="text-sm text-slate-500">Remember me</span>
              </label>
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</button>
            </div>
            
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xl rounded-2xl transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={24} />
                </>
              )}
            </button>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <ShieldCheck size={14} />
                <span>Secure Access</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs justify-end">
                <Clock size={14} />
                <span>v4.0.2 Stable</span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-400 text-sm mt-8 italic">
          Authorized Educators Only. System access is monitored.
        </p>
      </div>
    </div>
  );
}


