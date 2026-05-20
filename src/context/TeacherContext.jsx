import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const TeacherContext = createContext();

const MOCK_TEACHER_PROFILE = {
  id: 'tch-1',
  name: 'Mrs. Janet Bloom',
  email: 'teacher@somobloom.com',
  school: 'SomoBloom Elementary School',
  avatarUrl: null
};

const MOCK_TEACHER_CLASSES = [
  {
    id: 'class-1',
    name: 'Grade 4 Science',
    subject: 'Science',
    students: [
      {
        id: 's-1',
        name: 'Sarah Smith',
        portfolioCount: 3,
        attendance: { present: 18, total: 20 },
        cbcAssessments: {
          strands: [
            { name: 'Environment & Weather', level: 'proficient' },
            { name: 'Plants & Germination', level: 'exemplary' }
          ],
          competencies: {
            'Scientific Reasoning': 'proficient',
            'Observation': 'exemplary'
          }
        }
      },
      {
        id: 's-2',
        name: 'Alex Mercer',
        portfolioCount: 1,
        attendance: { present: 20, total: 20 },
        cbcAssessments: {
          strands: [
            { name: 'Environment & Weather', level: 'developing' },
            { name: 'Plants & Germination', level: 'proficient' }
          ],
          competencies: {
            'Scientific Reasoning': 'developing',
            'Observation': 'proficient'
          }
        }
      }
    ]
  },
  {
    id: 'class-2',
    name: 'Grade 6 Mathematics',
    subject: 'Mathematics',
    students: [
      {
        id: 's-3',
        name: 'Ben Carter',
        portfolioCount: 2,
        attendance: { present: 15, total: 20 },
        cbcAssessments: {
          strands: [
            { name: 'Algebra', level: 'proficient' },
            { name: 'Geometry', level: 'beginning' }
          ],
          competencies: {
            'Logical Deduction': 'proficient',
            'Calculations': 'developing'
          }
        }
      }
    ]
  }
];

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
      if (activeToken === 'mock_teacher_token') {
        const stored = localStorage.getItem('teacher_profile');
        const parsed = stored ? JSON.parse(stored) : MOCK_TEACHER_PROFILE;
        const storedClasses = localStorage.getItem('teacher_classes');
        const parsedClasses = storedClasses ? JSON.parse(storedClasses) : MOCK_TEACHER_CLASSES;
        setTeacherData({
          ...parsed,
          classes: parsedClasses,
          portfolioItems: []
        });
        return;
      }

      const { profile } = await api.get('/teacher/me');
      const { classes } = await api.get('/teacher/classes');
      
      setTeacherData({
        ...profile,
        classes: classes.map(c => ({
          ...c,
          students: c.students || []
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
      if (email === 'demo@somobloom.com' || email === 'teacher@somobloom.com') {
        localStorage.setItem('teacher_token', 'mock_teacher_token');
        localStorage.setItem('teacher_profile', JSON.stringify(MOCK_TEACHER_PROFILE));
        localStorage.setItem('teacher_classes', JSON.stringify(MOCK_TEACHER_CLASSES));
        setAuthToken('mock_teacher_token');
        return;
      }

      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('teacher_token', data.token);
      setAuthToken(data.token);
    } catch (err) {
      console.warn('Real API failed, falling back to demo mode:', err);
      localStorage.setItem('teacher_token', 'mock_teacher_token');
      localStorage.setItem('teacher_profile', JSON.stringify(MOCK_TEACHER_PROFILE));
      localStorage.setItem('teacher_classes', JSON.stringify(MOCK_TEACHER_CLASSES));
      setAuthToken('mock_teacher_token');
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
