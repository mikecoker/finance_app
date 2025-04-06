"use client";

import React, { useEffect, useState } from 'react';
import { Module } from '@/components/modules/ModuleCard';
import { ProgressProvider, useProgress } from '@/components/progress/ProgressProvider';
import { UserProfile } from '@/components/user/UserProfile';
import { ProgressDashboard } from '@/components/progress/ProgressDashboard';
import { ModuleGrid } from '@/components/modules/ModuleGrid';
import { ModuleDetail } from '@/components/modules/ModuleDetail';
import { BankingLessonDemo } from '@/components/lessons/BankingLessonDemo';
import { StepByStepLesson } from '@/components/lessons/StepByStepLesson';
import { CharacterDialog } from '@/components/characters/CharacterDialog';
import { 
  getModules, 
  getLessonsMetadata, 
  getLessonContent, 
  LessonMetadata, 
  LessonStep,
  saveLessonProgress,
  loadLessonProgress
} from '@/services/dataService';

// Main application component
export default function CourseApp() {
  return (
    <ProgressProvider>
      <CourseContent />
    </ProgressProvider>
  );
}

// Course content component with access to progress context
function CourseContent() {
  const [view, setView] = useState<'modules' | 'module-detail' | 'lesson'>('modules');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<LessonMetadata[]>([]);
  const [currentLessonContent, setCurrentLessonContent] = useState<LessonStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get progress context
  const { 
    completeLesson, 
    startLesson,
    updateLessonProgress
  } = useProgress();
  
  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      // Load modules
      const modulesData = await getModules();
      setModules(modulesData);
      
      // Load lessons metadata
      const lessonsData = await getLessonsMetadata();
      
      // Check for saved progress
      const savedProgress = loadLessonProgress();
      if (savedProgress) {
        setLessons(savedProgress);
      } else {
        setLessons(lessonsData);
      }
      
      setIsLoading(false);
    }
    
    loadData();
  }, []);
  
  // Initialize progress tracking for all modules (only once after data is loaded)
  useEffect(() => {
    if (!isLoading && modules.length > 0 && lessons.length > 0) {
      // Use a flag in localStorage to ensure this only runs once
      const progressInitialized = localStorage.getItem('finance_progress_initialized');
      if (!progressInitialized) {
        modules.forEach(module => {
          const moduleLessons = lessons.filter(l => l.moduleId === module.id);
          if (moduleLessons.length > 0) {
            // Start the first lesson of each module to ensure the module appears in tracking
            startLesson(module.id, moduleLessons[0].id);
          }
        });
        // Set flag to prevent this from running again
        localStorage.setItem('finance_progress_initialized', 'true');
      }
    }
  }, [isLoading, modules, lessons, startLesson]);
  
  // Load lesson content when a lesson is selected
  useEffect(() => {
    async function loadLessonContent() {
      if (selectedLesson) {
        const content = await getLessonContent(selectedLesson);
        setCurrentLessonContent(content);
        
        // Mark lesson as in progress when selected
        if (selectedModule) {
          startLesson(selectedModule, selectedLesson);
        }
      }
    }
    
    loadLessonContent();
  }, [selectedLesson, selectedModule, startLesson]);
  
  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    setView('module-detail');
  };
  
  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
    setView('lesson');
  };
  
  const handleNextLesson = () => {
    if (selectedModule && selectedLesson) {
      // Find current lesson index
      const currentLessonIndex = lessons.findIndex(l => l.id === selectedLesson);
      
      // Mark current lesson as completed in both local state and progress provider
      if (currentLessonIndex >= 0) {
        // Get the XP reward for this lesson
        const xpReward = lessons[currentLessonIndex].xpReward || 50;
        
        // Complete the lesson in the progress provider
        completeLesson(selectedModule, selectedLesson, 100, xpReward);
        
        // Start a new lesson in the progress provider if there's a next lesson
        if (currentLessonIndex < lessons.length - 1) {
          const nextLesson = lessons[currentLessonIndex + 1];
          // Pre-start the next lesson to ensure it appears in progress tracking
          startLesson(selectedModule, nextLesson.id);
        }
        
        // Update local state
        const updatedLessons = [...lessons];
        updatedLessons[currentLessonIndex] = {
          ...updatedLessons[currentLessonIndex],
          completed: true,
          current: false
        };
        
        // If there's a next lesson in this module
        if (currentLessonIndex < lessons.length - 1) {
          const nextLesson = lessons[currentLessonIndex + 1];
          setSelectedLesson(nextLesson.id);
          
          // Mark next lesson as current and unlock it
          updatedLessons[currentLessonIndex + 1] = {
            ...updatedLessons[currentLessonIndex + 1],
            current: true,
            locked: false
          };
          
          // Update lessons state and save to localStorage
          setLessons(updatedLessons);
          saveLessonProgress(updatedLessons);
        } else {
          // If this was the last lesson, go back to module view
          handleBackToModule();
        }
      }
    }
  };
  
  const handleBackToModules = () => {
    setView('modules');
    setSelectedModule(null);
    setSelectedLesson(null);
  };
  
  const handleBackToModule = () => {
    setView('module-detail');
    setSelectedLesson(null);
  };
  
  // Get the current lesson title
  const getCurrentLessonTitle = () => {
    if (!selectedLesson) return 'Lesson';
    const lesson = lessons.find(l => l.id === selectedLesson);
    return lesson?.title || 'Lesson';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading course content...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center">Personal Finance Course</h1>
          <p className="text-gray-600 text-center">Interactive learning with animated characters</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <UserProfile />
            <ProgressDashboard />
          </div>
          
          <div className="lg:col-span-3">
            {view === 'modules' && (
              <ModuleGrid 
                modules={modules}
                onModuleSelect={handleModuleSelect}
              />
            )}
            
            {view === 'module-detail' && selectedModule && (
              <ModuleDetail
                module={modules.find(m => m.id === selectedModule)!}
                lessons={lessons.filter(l => l.moduleId === selectedModule)}
                onLessonSelect={handleLessonSelect}
                onBackClick={handleBackToModules}
              />
            )}
            
            {view === 'lesson' && selectedModule && selectedLesson && (
              <div>
                <button
                  className="mb-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                  onClick={handleBackToModule}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Module
                </button>
                
                {/* Display different content based on the selected lesson */}
                {currentLessonContent.length > 0 && (
                  <StepByStepLesson
                    lessonContent={currentLessonContent}
                    onBackToModule={handleBackToModule}
                    onNextLesson={handleNextLesson}
                    lessonTitle={getCurrentLessonTitle()}
                    moduleId={selectedModule || ''}
                    lessonId={selectedLesson || ''}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
