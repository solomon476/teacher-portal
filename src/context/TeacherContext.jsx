import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const TeacherContext = createContext();



export function TeacherProvider({ children }) {
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('teacher_token'));

  const isAuthenticated = !!authToken;

  const fetchTeacherData = async () => {
    const activeToken = localStorage.getItem('teacher_token');
    if (!activeToken) return;
    setIsLoading(true);
    try {
      const { profile } = await api.get('/teacher/me');
      const { classes } = await api.get('/teacher/classes');
      let portfolio = [];
      try {
        const response = await api.get('/teacher/portfolio');
        portfolio = response.portfolio || [];
      } catch (err) {
        console.warn('Failed to load portfolio items, using empty list:', err);
      }
      
      setTeacherData({
        ...profile,
        classes: classes.map(c => ({
          ...c,
          students: c.students || []
        })),
        portfolioItems: portfolio
      });
    } catch (err) {
      console.error('Failed to fetch teacher data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchTeacherData();
    } else {
      setTeacherData(null);
    }
  }, [authToken]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('teacher_token', data.token);
      setAuthToken(data.token);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid credentials');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setTeacherData(null);
    localStorage.removeItem('teacher_token');
    localStorage.removeItem('teacher_profile');
    localStorage.removeItem('teacher_classes');
    setAuthToken(null);
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

  const uploadEvidence = async (formData) => {
    const activeToken = localStorage.getItem('teacher_token');
    if (activeToken) {
      try {
        const response = await api.postMultipart('/teacher/portfolio/upload', formData);
        if (response.item) {
          setTeacherData(prev => ({
            ...prev,
            portfolioItems: [response.item, ...(prev.portfolioItems || [])]
          }));
          return true;
        }
      } catch (err) {
        console.error('Failed to upload portfolio evidence to API:', err);
        alert(err.message || 'Failed to upload portfolio evidence');
      }
    }
    return false;
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

  const updateAssessmentLevel = async (classId, studentId, type, name, level) => {
    setTeacherData(prev => {
      if (!prev) return null;
      return {
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
      };
    });

    try {
      await api.post(`/teacher/classes/${classId}/assessments`, {
        studentProfileId: studentId,
        type,
        name,
        level
      });
    } catch (err) {
      console.error('Failed to update CBC assessment in backend:', err);
    }
  };

  const updateAttendance = async (classId, studentId, isPresent) => {
    setTeacherData(prev => {
      if (!prev) return null;
      return {
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
      };
    });

    try {
      await api.post(`/teacher/classes/${classId}/attendance`, {
        studentProfileId: studentId,
        isPresent
      });
    } catch (err) {
      console.error('Failed to log attendance in backend:', err);
    }
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
