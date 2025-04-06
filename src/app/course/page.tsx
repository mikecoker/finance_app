"use client";

import React, { useEffect, useState } from 'react';
import { Module } from '@/components/modules/ModuleCard';
import { ProgressProvider, useProgress } from '@/components/progress/ProgressProvider';
import { UserProfile } from '@/components/user/UserProfile';
import { ProgressDashboard } from '@/components/progress/ProgressDashboard';
import { ModuleGrid } from '@/components/modules/ModuleGrid';
import { ModuleDetail } from '@/components/modules/ModuleDetail';
import { BankingLessonDemo } from '@/components/lessons/BankingLessonDemo';
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
                {selectedLesson === 'banking-intro' && currentLessonContent.length > 0 && (
                  <BankingLessonDemo 
                    onBackToModule={handleBackToModule} 
                    onNextLesson={handleNextLesson}
                  />
                )}
                
                {selectedLesson === 'account-types' && currentLessonContent.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Types of Bank Accounts</h2>
                    <div className="mb-6">
                      <CharacterDialog
                        character="cash"
                        message="Now that you understand how banks work, let's explore the different types of accounts banks offer. Each account type serves different purposes and comes with its own features."
                        autoClose={false}
                      />
                    </div>
                    
                    <div className="space-y-6 mt-8">
                      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                        <h3 className="text-xl font-semibold mb-2">Checking Accounts</h3>
                        <p>Designed for everyday transactions like purchases and bill payments. They typically offer unlimited transactions but little to no interest.</p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>Easy access via debit cards, checks, and online transfers</li>
                          <li>May have monthly maintenance fees</li>
                          <li>Some banks offer free checking with minimum balance or direct deposit</li>
                        </ul>
                      </div>
                      
                      <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <h3 className="text-xl font-semibold mb-2">Savings Accounts</h3>
                        <p>Designed to help you save money and earn interest. They have some limitations on withdrawals.</p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>Earns higher interest than checking accounts</li>
                          <li>Limited to 6 withdrawals per month (federal regulation)</li>
                          <li>Good for emergency funds and short-term savings goals</li>
                        </ul>
                      </div>
                      
                      <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                        <h3 className="text-xl font-semibold mb-2">Money Market Accounts</h3>
                        <p>A hybrid between checking and savings accounts, offering higher interest rates with some check-writing privileges.</p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>Higher interest rates than regular savings accounts</li>
                          <li>May require higher minimum balances</li>
                          <li>Limited transactions similar to savings accounts</li>
                        </ul>
                      </div>
                      
                      <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                        <h3 className="text-xl font-semibold mb-2">Certificates of Deposit (CDs)</h3>
                        <p>Time deposits that require you to keep your money in the account for a specific term to earn the full interest.</p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>Higher interest rates than savings accounts</li>
                          <li>Terms range from 3 months to 5+ years</li>
                          <li>Early withdrawal penalties apply</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={handleBackToModule}
                      >
                        Back to Module
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleNextLesson}
                      >
                        Next Lesson
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedLesson !== 'banking-intro' && selectedLesson !== 'account-types' && currentLessonContent.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">
                      {lessons.find(l => l.id === selectedLesson)?.title || 'Lesson'}
                    </h2>
                    
                    {/* Display lesson content based on the loaded JSON data */}
                    <div className="space-y-8 mb-8">
                      {currentLessonContent.map((step, index) => (
                        <div key={index} className="lesson-step">
                          {step.type === 'intro' && (
                            <div className="mb-6">
                              <CharacterDialog
                                character={step.character as any}
                                message={step.content}
                                autoClose={false}
                              />
                            </div>
                          )}
                          
                          {step.type === 'content' && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                              <p>{step.content}</p>
                            </div>
                          )}
                          
                          {step.type === 'quiz' && (
                            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                              <p className="mb-4">{step.content}</p>
                              {step.options && (
                                <div className="space-y-2">
                                  {step.options.map((option, optIndex) => (
                                    <div key={optIndex} className="p-2 border rounded hover:bg-blue-100 cursor-pointer">
                                      {option.text}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {(step.type === 'interactive' || step.type === 'application') && (
                            <div className={`border rounded-lg p-4 ${
                              step.type === 'interactive' ? 'border-purple-200 bg-purple-50' : 'border-green-200 bg-green-50'
                            }`}>
                              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                              <p>{step.content}</p>
                            </div>
                          )}
                          
                          {step.type === 'complete' && (
                            <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                              <p>{step.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={handleBackToModule}
                      >
                        Back to Module
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleNextLesson}
                      >
                        Next Lesson
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
