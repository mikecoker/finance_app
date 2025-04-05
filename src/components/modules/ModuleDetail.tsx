import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Module } from './ModuleCard';
import { LessonCard } from './LessonCard';
import { CharacterDialog, CharacterType } from '@/components/characters';

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  locked: boolean;
  current: boolean;
}

interface ModuleDetailProps {
  module: Module;
  lessons: Lesson[];
  onLessonSelect: (moduleId: string, lessonId: string) => void;
  onBackClick: () => void;
  className?: string;
}

export const ModuleDetail: React.FC<ModuleDetailProps> = ({
  module,
  lessons,
  onLessonSelect,
  onBackClick,
  className,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  // Character color mapping
  const characterColors = {
    cash: {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      button: 'bg-blue-500 hover:bg-blue-600',
      text: 'text-blue-600',
    },
    investra: {
      bg: 'bg-green-100',
      border: 'border-green-300',
      button: 'bg-green-500 hover:bg-green-600',
      text: 'text-green-600',
    },
    securio: {
      bg: 'bg-purple-100',
      border: 'border-purple-300',
      button: 'bg-purple-500 hover:bg-purple-600',
      text: 'text-purple-600',
    },
    taxxy: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      button: 'bg-amber-500 hover:bg-amber-600',
      text: 'text-amber-600',
    },
  };
  
  // Level badge colors
  const levelColors = {
    foundation: 'bg-blue-500',
    intermediate: 'bg-cyan-500',
    advanced: 'bg-teal-500',
    mastery: 'bg-amber-500',
  };
  
  // Calculate progress percentage
  const progressPercentage = module.lessons > 0 
    ? Math.round((module.completedLessons / module.lessons) * 100) 
    : 0;
  
  return (
    <motion.div
      className={`${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.button
        className="mb-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
        onClick={onBackClick}
        variants={itemVariants}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Modules
      </motion.button>
      
      <motion.div 
        className={`p-6 rounded-xl shadow-md mb-6 ${characterColors[module.character].bg} border ${characterColors[module.character].border}`}
        variants={itemVariants}
      >
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold">{module.title}</h2>
          <span className={`text-xs font-medium text-white px-2 py-1 rounded-full ${levelColors[module.level]}`}>
            {module.level.charAt(0).toUpperCase() + module.level.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4">{module.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="font-medium">{module.completedLessons}</span>
            <span className="text-gray-700">/{module.lessons} lessons completed</span>
          </div>
          <div className="font-medium text-blue-600">
            +{module.xpReward} XP total
          </div>
        </div>
        
        <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5 mb-2">
          <div 
            className={`h-2.5 rounded-full ${characterColors[module.character].button}`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-6">
        <CharacterDialog
          character={module.character}
          emotion="excited"
          message={`Welcome to the ${module.title} module! Complete these lessons in order to master the concepts.`}
          position="left"
        />
      </motion.div>
      
      <motion.h3 
        className="text-xl font-bold mb-4"
        variants={itemVariants}
      >
        Module Lessons
      </motion.h3>
      
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
      >
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            moduleId={module.id}
            lessonId={lesson.id}
            title={lesson.title}
            description={lesson.description}
            character={module.character}
            xpReward={lesson.xpReward}
            completed={lesson.completed}
            locked={lesson.locked}
            current={lesson.current}
            onClick={onLessonSelect}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ModuleDetail;
