import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, GraduationCap, BookOpen, Users, Menu, X, ChevronDown, Bell } from 'lucide-react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useTeacher } from '../context/TeacherContext';
import ThemeCustomizer from '../components/ThemeCustomizer';
import SomoBloomLogo from '../components/SomoBloomLogo';

export default function PortalLayout() {
  const { teacherData, logout } = useTeacher();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'New Submission', text: 'Sarah Smith submitted a portfolio item.', time: '10m ago' },
    { id: 2, title: 'Attendance Reminder', text: 'Grade 4 Science attendance is pending.', time: '1h ago' },
  ];

  const navItems = [
    { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/classes', label: 'My Classes', icon: Users },
    { to: '/teacher/portfolio', label: 'Portfolio Manager', icon: BookOpen },
    { to: '/teacher/profile', label: 'Settings', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar - Professional SaaS Style */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-600 border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Brand */}
          <div className="p-6 flex items-center border-b border-slate-100">
            <SomoBloomLogo size={36} fontSize="17px" />
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/teacher'}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Bottom Section */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden border border-slate-200">
                {teacherData?.avatarUrl ? (
                  <img src={teacherData.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  teacherData?.name.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{teacherData?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{teacherData?.school}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 group-hover:text-red-500">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500">
            <Menu size={20} />
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">Dashboard</span>
          </div>

          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  <button onClick={() => setIsNotificationsOpen(false)} className="text-[10px] font-bold text-indigo-600 uppercase">Clear All</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {notifications.map(n => (
                    <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <p className="text-sm font-bold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button className="text-xs font-bold text-slate-600">View All Notifications</button>
                </div>
              </div>
            )}
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{teacherData?.name}</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {teacherData?.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-white p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
      <ThemeCustomizer />
    </div>
  );
}
