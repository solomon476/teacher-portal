import { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import EvidenceGrid from '../../components/portfolio/EvidenceGrid';
import { 
  Plus, 
  Search, 
  Filter, 
  X, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Check,
  ChevronDown,
  Trash2
} from 'lucide-react';

export default function TeacherPortfolio() {
  const { teacherData, uploadEvidence } = useTeacher();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [modalClassId, setModalClassId] = useState('');

  const portfolioItems = teacherData?.portfolioItems || [];
  const classes = teacherData?.classes || [];

  // Extract unique tags
  const allTags = Array.from(new Set(portfolioItems.flatMap(item => item.tags || [])));

  // Filter items
  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || item.classId === selectedClass;
    const matchesTag = selectedTag === 'all' || (item.tags && item.tags.includes(selectedTag));
    return matchesSearch && matchesClass && matchesTag;
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const success = await uploadEvidence(formData);
    if (success) {
      setIsUploadModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Manager</h1>
          <p className="text-slate-500 font-medium">Upload and organize student work evidence.</p>
        </div>
        <button 
          onClick={() => {
            setIsUploadModalOpen(true);
            setModalClassId(classes[0]?.id || '');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          <Plus size={20} /> Upload Evidence
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl border border-gray-100  shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-slate-100 border-none rounded-xl text-sm py-2 px-4 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <select 
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-white border border-slate-100 border-none rounded-xl text-sm py-2 px-4 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>

          <button 
            onClick={() => {setSearchQuery(''); setSelectedClass('all'); setSelectedTag('all');}}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Portfolio Grid */}
      <EvidenceGrid items={filteredItems} />

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white border border-slate-100 shadow-sm dark:bg-white border border-slate-100 rounded-3xl border-2 border-dashed border-gray-200  p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No evidence found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Upload student work to start building the portfolio library.
          </p>
          <button 
            onClick={() => {
              setIsUploadModalOpen(true);
              setModalClassId(classes[0]?.id || '');
            }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 shadow-sm border border-gray-200  rounded-xl font-medium hover:bg-white border border-slate-100 transition-all"
          >
            <Plus size={18} /> Upload Now
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 shadow-sm w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100  flex items-center justify-between">
              <h2 className="text-xl font-bold">Upload Evidence</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
                <input required name="title" type="text" placeholder="e.g. Science Lab Report" className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Type</label>
                  <select name="type" className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Class <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    name="classId" 
                    value={modalClassId}
                    onChange={(e) => setModalClassId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Student <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    name="studentProfileId" 
                    className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {(classes.find(c => c.id === modalClassId)?.students || []).map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Evidence Media File <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    name="file" 
                    type="file" 
                    accept="image/*" 
                    className="w-full px-4 py-2 bg-white border border-slate-100 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Tags <span className="text-xs text-gray-400">(comma separated)</span></label>
                <input name="tags" type="text" placeholder="e.g. Physics, Lab, Grade A" className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" rows={3} placeholder="Briefly describe the evidence..." className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200  rounded-xl font-semibold hover:bg-white border border-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

