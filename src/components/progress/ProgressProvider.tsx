import React from 'react';
import { Module } from '@/components/modules/ModuleCard';

// Define progress tracking types
export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  streak: {
    current: number;
    lastActivity: string; // ISO date
  };
  moduleProgress: Record<string, ModuleProgress>;
}

export interface ModuleProgress {
  moduleId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  completionPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
  lessonProgress: Record<string, LessonProgress>;
}

export interface LessonProgress {
  lessonId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  completionPercentage: number;
  score: number;
  completedAt?: string; // ISO date
  attempts: number;
}

// Create a React Context for progress tracking
interface ProgressContextType {
  userProgress: UserProgress | null;
  isLoading: boolean;
  updateLessonProgress: (moduleId: string, lessonId: string, progress: Partial<LessonProgress>) => void;
  completeLesson: (moduleId: string, lessonId: string, score: number, xpEarned: number) => void;
  startLesson: (moduleId: string, lessonId: string) => void;
  getUserLevel: () => { level: number, xp: number, nextLevelXp: number, percentage: number };
  getModuleProgress: (moduleId: string) => ModuleProgress | null;
  getLessonProgress: (moduleId: string, lessonId: string) => LessonProgress | null;
  updateStreak: () => void;
}

// Default context value
const defaultProgressContext: ProgressContextType = {
  userProgress: null,
  isLoading: true,
  updateLessonProgress: () => {},
  completeLesson: () => {},
  startLesson: () => {},
  getUserLevel: () => ({ level: 1, xp: 0, nextLevelXp: 100, percentage: 0 }),
  getModuleProgress: () => null,
  getLessonProgress: () => null,
  updateStreak: () => {},
};

// Create the context
export const ProgressContext = React.createContext<ProgressContextType>(defaultProgressContext);

// XP required for each level
const levelXpRequirements = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
];

// Provider component
interface ProgressProviderProps {
  children: React.ReactNode;
  userId?: string; // Optional, for when user is not authenticated
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ 
  children,
  userId = 'guest',
}) => {
  const [userProgress, setUserProgress] = React.useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Initialize or load progress from localStorage
  React.useEffect(() => {
    const loadProgress = async () => {
      try {
        // Try to load from localStorage
        const storedProgress = localStorage.getItem(`finance_progress_${userId}`);
        
        if (storedProgress) {
          setUserProgress(JSON.parse(storedProgress));
        } else {
          // Initialize new progress
          const newProgress: UserProgress = {
            userId,
            xp: 0,
            level: 1,
            streak: {
              current: 0,
              lastActivity: new Date().toISOString().split('T')[0],
            },
            moduleProgress: {},
          };
          
          setUserProgress(newProgress);
          localStorage.setItem(`finance_progress_${userId}`, JSON.stringify(newProgress));
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        // Initialize with default values on error
        const newProgress: UserProgress = {
          userId,
          xp: 0,
          level: 1,
          streak: {
            current: 0,
            lastActivity: new Date().toISOString().split('T')[0],
          },
          moduleProgress: {},
        };
        
        setUserProgress(newProgress);
        localStorage.setItem(`finance_progress_${userId}`, JSON.stringify(newProgress));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, [userId]);
  
  // Save progress to localStorage whenever it changes
  React.useEffect(() => {
    if (userProgress) {
      localStorage.setItem(`finance_progress_${userId}`, JSON.stringify(userProgress));
    }
  }, [userProgress, userId]);
  
  // Calculate user level based on XP
  const getUserLevel = () => {
    if (!userProgress) {
      return { level: 1, xp: 0, nextLevelXp: 100, percentage: 0 };
    }
    
    const { xp, level } = userProgress;
    const currentLevelXp = levelXpRequirements[level - 1] || 0;
    const nextLevelXp = levelXpRequirements[level] || currentLevelXp + 1000;
    const xpForCurrentLevel = xp - currentLevelXp;
    const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
    const percentage = Math.round((xpForCurrentLevel / xpRequiredForNextLevel) * 100);
    
    return {
      level,
      xp,
      nextLevelXp,
      percentage,
    };
  };
  
  // Get module progress
  const getModuleProgress = (moduleId: string): ModuleProgress | null => {
    if (!userProgress) return null;
    return userProgress.moduleProgress[moduleId] || null;
  };
  
  // Get lesson progress
  const getLessonProgress = (moduleId: string, lessonId: string): LessonProgress | null => {
    if (!userProgress) return null;
    const moduleProgress = userProgress.moduleProgress[moduleId];
    if (!moduleProgress) return null;
    return moduleProgress.lessonProgress[lessonId] || null;
  };
  
  // Update lesson progress
  const updateLessonProgress = (
    moduleId: string, 
    lessonId: string, 
    progress: Partial<LessonProgress>
  ) => {
    if (!userProgress) return;
    
    setUserProgress(prev => {
      if (!prev) return prev;
      
      // Create deep copy to avoid direct state mutation
      const updatedProgress = { ...prev };
      
      // Ensure module progress exists
      if (!updatedProgress.moduleProgress[moduleId]) {
        updatedProgress.moduleProgress[moduleId] = {
          moduleId,
          status: 'available',
          completionPercentage: 0,
          lessonsCompleted: 0,
          totalLessons: 0,
          lessonProgress: {},
        };
      }
      
      // Ensure lesson progress exists
      if (!updatedProgress.moduleProgress[moduleId].lessonProgress[lessonId]) {
        updatedProgress.moduleProgress[moduleId].lessonProgress[lessonId] = {
          lessonId,
          status: 'available',
          completionPercentage: 0,
          score: 0,
          attempts: 0,
        };
      }
      
      // Update lesson progress
      updatedProgress.moduleProgress[moduleId].lessonProgress[lessonId] = {
        ...updatedProgress.moduleProgress[moduleId].lessonProgress[lessonId],
        ...progress,
      };
      
      return updatedProgress;
    });
  };
  
  // Start a lesson
  const startLesson = (moduleId: string, lessonId: string) => {
    if (!userProgress) return;
    
    updateLessonProgress(moduleId, lessonId, {
      status: 'in_progress',
      attempts: (getLessonProgress(moduleId, lessonId)?.attempts || 0) + 1,
    });
    
    // Also update module status if needed
    setUserProgress(prev => {
      if (!prev) return prev;
      
      const updatedProgress = { ...prev };
      
      if (updatedProgress.moduleProgress[moduleId]?.status === 'available') {
        updatedProgress.moduleProgress[moduleId].status = 'in_progress';
      }
      
      return updatedProgress;
    });
  };
  
  // Complete a lesson
  const completeLesson = (
    moduleId: string, 
    lessonId: string, 
    score: number,
    xpEarned: number
  ) => {
    if (!userProgress) return;
    
    // Update lesson progress
    updateLessonProgress(moduleId, lessonId, {
      status: 'completed',
      completionPercentage: 100,
      score,
      completedAt: new Date().toISOString(),
    });
    
    // Update module progress and user XP
    setUserProgress(prev => {
      if (!prev) return prev;
      
      const updatedProgress = { ...prev };
      const moduleProgress = updatedProgress.moduleProgress[moduleId];
      
      // Count completed lessons
      const lessonProgresses = Object.values(moduleProgress.lessonProgress);
      const completedLessons = lessonProgresses.filter(lp => lp.status === 'completed').length;
      
      // Update module completion percentage
      moduleProgress.lessonsCompleted = completedLessons;
      moduleProgress.totalLessons = Math.max(moduleProgress.totalLessons, lessonProgresses.length);
      moduleProgress.completionPercentage = Math.round(
        (completedLessons / moduleProgress.totalLessons) * 100
      );
      
      // Check if module is completed
      if (moduleProgress.completionPercentage === 100) {
        moduleProgress.status = 'completed';
      }
      
      // Add XP
      updatedProgress.xp += xpEarned;
      
      // Check for level up
      while (
        updatedProgress.level < levelXpRequirements.length &&
        updatedProgress.xp >= levelXpRequirements[updatedProgress.level]
      ) {
        updatedProgress.level += 1;
      }
      
      // Update streak
      updateStreak();
      
      return updatedProgress;
    });
  };
  
  // Update streak
  const updateStreak = () => {
    if (!userProgress) return;
    
    setUserProgress(prev => {
      if (!prev) return prev;
      
      const updatedProgress = { ...prev };
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = updatedProgress.streak.lastActivity;
      
      // If already updated today, do nothing
      if (lastActivity === today) {
        return updatedProgress;
      }
      
      // Check if last activity was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActivity === yesterdayStr) {
        // Streak continues
        updatedProgress.streak.current += 1;
      } else {
        // Streak broken
        updatedProgress.streak.current = 1;
      }
      
      updatedProgress.streak.lastActivity = today;
      
      return updatedProgress;
    });
  };
  
  // Context value
  const contextValue: ProgressContextType = {
    userProgress,
    isLoading,
    updateLessonProgress,
    completeLesson,
    startLesson,
    getUserLevel,
    getModuleProgress,
    getLessonProgress,
    updateStreak,
  };
  
  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};

// Custom hook for using the progress context
export const useProgress = () => {
  const context = React.useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export default ProgressProvider;
