import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const TeacherContext = createContext();

export function TeacherProvider({ children }) {
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('teacher_token');
  const isAuthenticated = !!token;

  const fetchTeacherData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const { profile } = await api.get('/teacher/me');
      const { classes } = await api.get('/teacher/classes');
      
      setTeacherData({
        ...profile,
        classes: classes.map(c => ({
          ...c,
          students: [] // Students can be fetched per class later
        })),
        portfolioItems: []
      });
    } catch (err) {
      console.error('Failed to fetch teacher data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeacherData();
    } else {
      setTeacherData(null);
    }
  }, [isAuthenticated]);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('teacher_token', data.token);
    await fetchTeacherData();
  };

  const logout = () => {
    setTeacherData(null);
    localStorage.removeItem('teacher_token');
  };

  const addClass = (newClass) => {
    setTeacherData(prev => ({
      ...prev,
      classes: [...prev.classes, { ...newClass, id: `c-${Date.now()}`, students: [] }]
    }));
  };

  const addStudent = (classId, student) => {
    setTeacherData(prev => ({
      ...prev,
      classes: prev.classes.map(c => 
        c.id === classId 
          ? { ...c, students: [...c.students, { ...student, id: `s-${Date.now()}`, portfolioCount: 0, cbcAssessments: { strands: [], competencies: {} }, attendance: { present: 0, total: 0 } }] }
          : c
      )
    }));
  };

  const removeStudent = (classId, studentId) => {
    setTeacherData(prev => ({
      ...prev,
      classes: prev.classes.map(c => 
        c.id === classId 
          ? { ...c, students: c.students.filter(s => s.id !== studentId) }
          : c
      )
    }));
  };

  const uploadEvidence = (item) => {
    setTeacherData(prev => ({
      ...prev,
      portfolioItems: [{ ...item, id: `p-${Date.now()}`, date: new Date().toISOString() }, ...prev.portfolioItems]
    }));
  };

  const updateTags = (itemId, newTags) => {
    setTeacherData(prev => ({
      ...prev,
      portfolioItems: prev.portfolioItems.map(item =>
        item.id === itemId ? { ...item, tags: newTags } : item
      )
    }));
  };

  const updateProfile = (newData) => {
    setTeacherData(prev => ({ ...prev, ...newData }));
  };

  const updateAssessmentLevel = (classId, studentId, type, name, level) => {
    setTeacherData(prev => ({
      ...prev,
      classes: prev.classes.map(c => 
        c.id === classId 
          ? {
              ...c,
              students: c.students.map(s =>
                s.id === studentId
                  ? {
                      ...s,
                      cbcAssessments: {
                        ...s.cbcAssessments,
                        [type]: type === 'strands' 
                          ? (s.cbcAssessments?.strands || []).map(st => st.name === name ? { ...st, level } : st)
                          : { ...s.cbcAssessments?.competencies, [name]: level }
                      }
                    }
                  : s
              )
            }
          : c
      )
    }));
  };

  const updateAttendance = (classId, studentId, isPresent) => {
    setTeacherData(prev => ({
      ...prev,
      classes: prev.classes.map(c => 
        c.id === classId 
          ? {
              ...c,
              students: c.students.map(s =>
                s.id === studentId
                  ? {
                      ...s,
                      attendance: {
                        ...s.attendance,
                        present: isPresent ? s.attendance.present + 1 : Math.max(0, s.attendance.present - 1),
                        total: s.attendance.total + 1
                      }
                    }
                  : s
              )
            }
          : c
      )
    }));
  };

  return (
    <TeacherContext.Provider value={{
      teacherData,
      isLoading,
      error,
      login,
      logout,
      addClass,
      addStudent,
      removeStudent,
      uploadEvidence,
      updateTags,
      updateProfile,
      updateAssessmentLevel,
      updateAttendance,
      refreshData: fetchTeacherData
    }}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
}
