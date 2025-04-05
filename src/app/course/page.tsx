"use client";

import React from 'react';
import { Module } from '@/components/modules/ModuleCard';
import { ProgressProvider } from '@/components/progress/ProgressProvider';
import { UserProfile } from '@/components/user/UserProfile';
import { ProgressDashboard } from '@/components/progress/ProgressDashboard';
import { ModuleGrid } from '@/components/modules/ModuleGrid';
import { ModuleDetail } from '@/components/modules/ModuleDetail';
import { BankingLessonDemo } from '@/components/lessons/BankingLessonDemo';

// Sample data for demonstration
const sampleModules: Module[] = [
  {
    id: 'banking-fundamentals',
    title: 'Banking Fundamentals',
    description: 'Learn how banks operate, different account types, and how to choose the right bank for your needs.',
    character: 'cash',
    level: 'foundation',
    lessons: 5,
    completedLessons: 2,
    xpReward: 250,
    prerequisites: [],
    unlocked: true,
  },
  {
    id: 'budgeting-basics',
    title: 'Budgeting Basics',
    description: 'Master the essentials of creating and maintaining a personal budget to achieve your financial goals.',
    character: 'cash',
    level: 'foundation',
    lessons: 4,
    completedLessons: 0,
    xpReward: 200,
    prerequisites: [],
    unlocked: true,
  },
  {
    id: 'credit-cards-101',
    title: 'Credit Cards 101',
    description: 'Understand how credit cards work, their benefits and risks, and how to use them responsibly.',
    character: 'securio',
    level: 'foundation',
    lessons: 6,
    completedLessons: 0,
    xpReward: 300,
    prerequisites: ['banking-fundamentals'],
    unlocked: true,
  },
  {
    id: 'investing-basics',
    title: 'Investing Basics',
    description: 'Learn the fundamentals of investing, different investment vehicles, and how to start building a portfolio.',
    character: 'investra',
    level: 'intermediate',
    lessons: 8,
    completedLessons: 0,
    xpReward: 400,
    prerequisites: ['banking-fundamentals', 'budgeting-basics'],
    unlocked: false,
  },
  {
    id: 'tax-essentials',
    title: 'Tax Essentials',
    description: 'Understand the basics of income tax, deductions, credits, and strategies to optimize your tax situation.',
    character: 'taxxy',
    level: 'intermediate',
    lessons: 7,
    completedLessons: 0,
    xpReward: 350,
    prerequisites: ['banking-fundamentals'],
    unlocked: false,
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Plan for your future with strategies for retirement savings, accounts, and income planning.',
    character: 'investra',
    level: 'advanced',
    lessons: 6,
    completedLessons: 0,
    xpReward: 450,
    prerequisites: ['investing-basics'],
    unlocked: false,
  },
];

// Sample lessons for Banking Fundamentals module
const sampleLessons = [
  {
    id: 'banking-intro',
    moduleId: 'banking-fundamentals',
    title: 'Introduction to Banking',
    description: 'Learn what banks are and how they function in the economy.',
    xpReward: 50,
    completed: true,
    locked: false,
    current: false,
  },
  {
    id: 'account-types',
    moduleId: 'banking-fundamentals',
    title: 'Types of Bank Accounts',
    description: 'Explore checking, savings, and other account types.',
    xpReward: 50,
    completed: true,
    locked: false,
    current: false,
  },
  {
    id: 'banking-fees',
    moduleId: 'banking-fundamentals',
    title: 'Understanding Banking Fees',
    description: 'Learn about common fees and how to avoid them.',
    xpReward: 50,
    completed: false,
    locked: false,
    current: true,
  },
  {
    id: 'online-banking',
    moduleId: 'banking-fundamentals',
    title: 'Online and Mobile Banking',
    description: 'Master digital banking tools and features.',
    xpReward: 50,
    completed: false,
    locked: false,
    current: false,
  },
  {
    id: 'banking-security',
    moduleId: 'banking-fundamentals',
    title: 'Banking Security',
    description: 'Protect your accounts and personal information.',
    xpReward: 50,
    completed: false,
    locked: true,
    current: false,
  },
];

// Main application component
export default function CourseApp() {
  const [view, setView] = React.useState<'modules' | 'module-detail' | 'lesson'>('modules');
  const [selectedModule, setSelectedModule] = React.useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = React.useState<string | null>(null);
  
  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    setView('module-detail');
  };
  
  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
    setView('lesson');
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
  
  return (
    <ProgressProvider>
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
                  modules={sampleModules}
                  onModuleSelect={handleModuleSelect}
                />
              )}
              
              {view === 'module-detail' && selectedModule && (
                <ModuleDetail
                  module={sampleModules.find(m => m.id === selectedModule)!}
                  lessons={sampleLessons.filter(l => l.moduleId === selectedModule)}
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
                  
                  <BankingLessonDemo />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProgressProvider>
  );
}
