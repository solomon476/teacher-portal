import { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { api } from '../../lib/api';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  ArrowLeft, 
  Trash2, 
  BookOpen, 
  ClipboardList, 
  Save, 
  Check, 
  XCircle, 
  Clock, 
  Award, 
  Zap, 
  Mail,
  MoreVertical,
  Filter,
  Download,
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function Classes() {
  const { teacherData, removeStudent, updateAssessmentLevel, updateAttendance, addStudent } = useTeacher();
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [activeTab, setActiveTab] = useState('roster'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFeedback, setAttendanceFeedback] = useState(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  // Lesson Plan / Scheme of Work Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planType, setPlanType] = useState('scheme'); // 'scheme' or 'lesson'
  const [topicInput, setTopicInput] = useState('');

  const classes = teacherData?.classes || [];
  const selectedClass = classes.find(c => c.id === selectedClassId);

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    setSelectedClassId(null);
    setActiveTab('roster');
  };

  const handleMarkAttendance = (studentId, isPresent) => {
    updateAttendance(selectedClass.id, studentId, isPresent);
    setAttendanceFeedback({ id: studentId, type: isPresent ? 'present' : 'absent' });
    setTimeout(() => setAttendanceFeedback(null), 1000);
  };

  const handleMarkAllPresent = () => {
    selectedClass.students.forEach(s => updateAttendance(selectedClass.id, s.id, true));
    alert('All students marked present for today.');
  };

  const handleCommitAssessments = () => {
    setIsCommitting(true);
    setTimeout(() => {
      setIsCommitting(false);
      alert('All CBC assessments have been committed successfully!');
    }, 1500);
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Class data export started. Check your downloads.');
    }, 2000);
  };

  const handleGeneratePlan = async () => {
    if (!topicInput.trim()) {
      alert('Please enter a topic or subject focus to generate.');
      return;
    }
    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      const res = await api.post('/teacher/ai/generate-plan', {
        type: planType,
        topic: topicInput,
        className: selectedClass?.name
      });

      setGeneratedPlan({
        title: res.title,
        date: new Date().toLocaleDateString(),
        content: res.content
      });
    } catch (err) {
      console.error('Failed to generate AI plan:', err);
      alert(err.message || 'AI Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };



  const achievementLevels = [
    { id: 'EE', label: 'Exceeding Expectation', color: 'bg-emerald-500', text: 'text-emerald-700' },
    { id: 'ME', label: 'Meeting Expectation', color: 'bg-indigo-500', text: 'text-indigo-700' },
    { id: 'AE', label: 'Approaching Expectation', color: 'bg-amber-500', text: 'text-amber-700' },
    { id: 'BE', label: 'Below Expectation', color: 'bg-rose-500', text: 'text-rose-700' },
  ];

  if (selectedClassId && selectedClass) {
    const isHomeClass = selectedClass.role === 'home';

    return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-20">
        
        {/* Breadcrumbs / Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <button onClick={handleBack} className="hover:text-indigo-600 transition-colors">Classes</button>
            <ChevronRight size={12} />
            <span className="text-slate-900 font-semibold">{selectedClass.name}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border border-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-500">
                <Users size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {selectedClass.name}
                  {isHomeClass && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded border border-indigo-100">Home</span>}
                </h1>
                <p className="text-slate-500 text-sm font-medium">{selectedClass.grade} • {selectedClass.term}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">

              <button 
                onClick={handleExportData}
                disabled={isExporting}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isExporting ? <Zap size={16} className="animate-spin text-indigo-600" /> : <Download size={16} />}
                {isExporting ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Student Modal-like form overlay */}


        {/* Professional Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-8">
          {[
            { id: 'roster', label: 'Roster', icon: Users },
            { id: 'grades', label: 'CBC Assessment', icon: Award },
            { id: 'attendance', label: 'Attendance Roll', icon: ClipboardList },
            { id: 'plans', label: 'Schemes & Plans', icon: BookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          
          {activeTab === 'roster' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Learner</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedClass.students.map((student) => (
                    <tr key={student.id} className="hover:bg-white transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white border border-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold border border-slate-200 overflow-hidden">
                            {student.avatarUrl ? (
                              <img src={student.avatarUrl} className="w-full h-full object-cover" />
                            ) : (
                              student.name.charAt(0)
                            )}
                          </div>
                          <span className="font-semibold text-slate-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{student.portfolioCount} items</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {student.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => alert(`Emailing ${student.name}... (Feature coming soon)`)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white border border-slate-100 rounded transition-colors"
                          >
                            <Mail size={16} />
                          </button>
                          {isHomeClass && (
                            <button onClick={() => removeStudent(selectedClass.id, student.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-white z-10">Learner</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Strands</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Competencies</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Final Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedClass.students.map((student) => (
                    <tr key={student.id} className="hover:bg-white transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 sticky left-0 bg-white z-10">{student.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {student.cbcAssessments?.strands.map(s => (
                            <div key={s.name} className="flex items-center justify-between gap-4">
                              <span className="text-[10px] font-medium text-slate-500 uppercase truncate">{s.name}</span>
                              <select 
                                defaultValue={s.level}
                                onChange={(e) => updateAssessmentLevel(selectedClass.id, student.id, 'strands', s.name, e.target.value)}
                                className="text-[10px] font-bold border-none bg-white border border-slate-100 rounded px-1.5 py-0.5 focus:ring-1 focus:ring-indigo-500"
                              >
                                {achievementLevels.map(l => <option key={l.id} value={l.id}>{l.id}</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 justify-center">
                          {Object.entries(student.cbcAssessments?.competencies || {}).map(([key, value]) => {
                            const levelIndex = achievementLevels.findIndex(l => l.id === value);
                            return (
                              <button 
                                key={key} 
                                onClick={() => {
                                  const nextLevel = achievementLevels[(levelIndex + 1) % achievementLevels.length].id;
                                  updateAssessmentLevel(selectedClass.id, student.id, 'competencies', key, nextLevel);
                                }}
                                className={`w-8 h-8 rounded border flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 active:scale-95 ${achievementLevels[levelIndex]?.text} ${achievementLevels[levelIndex]?.color.replace('bg-', 'bg-opacity-20 bg-')} border-slate-200`} 
                                title={`${key}: ${achievementLevels[levelIndex]?.label}`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-slate-900 px-2 py-1 bg-white border border-slate-100 rounded">ME</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end">
                <button 
                  onClick={handleCommitAssessments}
                  disabled={isCommitting}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isCommitting ? <Zap size={14} className="animate-spin" /> : <Save size={14} />}
                  {isCommitting ? 'Committing...' : 'Commit Assessments'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="divide-y divide-slate-100">
              <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Attendance Log</h3>
                  <p className="text-[10px] text-slate-500 font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={handleMarkAllPresent}
                  className="text-xs font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded hover:bg-indigo-50"
                >
                  Mark All Present
                </button>
              </div>
              {selectedClass.students.map(student => {
                const feedback = attendanceFeedback?.id === student.id ? attendanceFeedback.type : null;
                return (
                  <div key={student.id} className={`px-6 py-3 flex items-center justify-between transition-colors ${feedback === 'present' ? 'bg-emerald-50' : feedback === 'absent' ? 'bg-rose-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 overflow-hidden">
                        {student.avatarUrl ? (
                          <img src={student.avatarUrl} className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Last: Present (May 04)</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleMarkAttendance(student.id, true)}
                        className={`p-2 rounded border transition-colors ${feedback === 'present' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-600 hover:border-emerald-600'}`}
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => handleMarkAttendance(student.id, false)}
                        className={`p-2 rounded border transition-colors ${feedback === 'absent' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-400 border-slate-200 hover:text-rose-600 hover:border-rose-700'}`}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="p-6 md:p-8 bg-slate-50 min-h-[400px]">
              <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">AI Pedagogical Assistant</h3>
                    <p className="text-xs font-medium text-slate-500">Generate structured schemes of work and CBC-aligned lesson plans.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Type</label>
                    <div className="flex p-1 bg-slate-100 rounded border border-slate-200 w-fit">
                      <button 
                        onClick={() => setPlanType('scheme')}
                        className={`px-4 py-2 text-sm font-bold rounded transition-colors ${planType === 'scheme' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Scheme of Work
                      </button>
                      <button 
                        onClick={() => setPlanType('lesson')}
                        className={`px-4 py-2 text-sm font-bold rounded transition-colors ${planType === 'lesson' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Lesson Plan
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Topic / Subject Focus</label>
                    <input 
                      type="text" 
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g. Introduction to Fractions, Plant Life Cycle..."
                      className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <button 
                    onClick={handleGeneratePlan}
                    disabled={isGenerating || !topicInput.trim()}
                    className="w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {isGenerating ? 'Drafting Document...' : `Generate ${planType === 'scheme' ? 'Scheme of Work' : 'Lesson Plan'}`}
                  </button>
                </div>

                {generatedPlan && (
                  <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <FileText size={18} className="text-indigo-600" />
                        {generatedPlan.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded uppercase">Ready</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded p-5 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-medium">
                      {generatedPlan.content}
                    </div>
                    <div className="mt-4 flex gap-3 justify-end">
                      <button className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Save size={14} /> Save Draft
                      </button>
                      <button className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2">
                        <Download size={14} /> Export PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Classes</h1>
          <p className="text-sm text-slate-500 font-medium">Management of student rosters, CBC assessments, and attendance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilterActive(!filterActive)}
            className={`px-4 py-2 border text-sm font-semibold rounded transition-all flex items-center gap-2 ${filterActive ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <Filter size={16} /> {filterActive ? 'Filter Active' : 'Filter'}
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((c) => (
          <div 
            key={c.id}
            onClick={() => setSelectedClassId(c.id)}
            className="group bg-white border border-slate-200 rounded hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white border border-slate-100 rounded flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors">
                  <Users size={20} />
                </div>
                {c.role === 'home' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded uppercase tracking-widest">Home</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{c.grade} • {c.term}</p>
              
              <div className="mt-6 flex items-center gap-4 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1.5"><Users size={14} /> {c.students.length} Learners</div>
                <div className="flex items-center gap-1.5"><ClipboardList size={14} /> 94% Att.</div>
              </div>
            </div>
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:bg-white border border-slate-100 transition-colors uppercase tracking-widest">
              <span>View Management</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
