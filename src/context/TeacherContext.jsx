import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const TeacherContext = createContext();

const initialTeacherData = {
  id: 't-1',
  name: 'Mr. Solomon',
  email: 'solomon@school.edu',
  avatarUrl: null,
  school: 'Somobloom',
  classes: [
    {
      id: 'c-1',
      name: 'Grade 4 Science',
      grade: 'Grade 4',
      term: 'Term 1, 2026',
      role: 'home',
      students: [
        { 
          id: 's-1', 
          name: 'Alex Johnson', 
          email: 'alex@school.edu', 
          status: 'Active', 
          portfolioCount: 4,
          cbcAssessments: {
            strands: [
              { name: 'Living Things', level: 'EE' },
              { name: 'Environment', level: 'ME' }
            ],
            competencies: {
              communication: 'ME',
              criticalThinking: 'EE',
              selfEfficacy: 'ME'
            }
          },
          attendance: { present: 18, total: 20 }
        },
        { 
          id: 's-2', 
          name: 'Sarah Smith', 
          email: 'sarah@school.edu', 
          status: 'Active', 
          portfolioCount: 2,
          cbcAssessments: {
            strands: [
              { name: 'Living Things', level: 'ME' },
              { name: 'Environment', level: 'AE' }
            ],
            competencies: {
              communication: 'EE',
              criticalThinking: 'ME',
              selfEfficacy: 'EE'
            }
          },
          attendance: { present: 20, total: 20 }
        },
      ]
    },
    {
      id: 'c-2',
      name: 'Grade 5 Mathematics',
      grade: 'Grade 5',
      term: 'Term 1, 2026',
      role: 'subject',
      students: [
        { 
          id: 's-3', 
          name: 'Michael Brown', 
          email: 'michael@school.edu', 
          status: 'Active', 
          portfolioCount: 1,
          cbcAssessments: {
            strands: [
              { name: 'Numbers', level: 'ME' },
              { name: 'Measurement', level: 'EE' }
            ],
            competencies: {
              communication: 'ME',
              criticalThinking: 'AE',
              selfEfficacy: 'ME'
            }
          },
          attendance: { present: 15, total: 15 }
        },
      ]
    }
  ],
  portfolioItems: []
};

export function TeacherProvider({ children }) {
  const [teacherData, setTeacherData] = useState(() => {
    const saved = localStorage.getItem('teacherData');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (teacherData) {
      localStorage.setItem('teacherData', JSON.stringify(teacherData));
    } else {
      localStorage.removeItem('teacherData');
      localStorage.removeItem('teacher_token');
    }
  }, [teacherData]);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('teacher_token', data.token);
      setTeacherData({
        ...initialTeacherData, // Keep mock structure for now but with real user info
        ...data.user,
        avatarUrl: null,
      });
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  };

  const logout = () => {
    setTeacherData(null);
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
      login,
      logout,
      addClass,
      addStudent,
      removeStudent,
      uploadEvidence,
      updateTags,
      updateProfile,
      updateAssessmentLevel,
      updateAttendance
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
