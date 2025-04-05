import React from 'react';
import { motion } from 'framer-motion';
import { Module } from './ModuleCard';
import { CharacterType } from '@/components/characters';

interface LessonCardProps {
  moduleId: string;
  lessonId: string;
  title: string;
  description: string;
  character: CharacterType;
  xpReward: number;
  completed: boolean;
  locked: boolean;
  current: boolean;
  onClick: (moduleId: string, lessonId: string) => void;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  moduleId,
  lessonId,
  title,
  description,
  character,
  xpReward,
  completed,
  locked,
  current,
  onClick,
  className,
}) => {
  // Character color mapping
  const characterColors = {
    cash: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      button: 'bg-blue-500 hover:bg-blue-600',
      text: 'text-blue-600',
    },
    investra: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      button: 'bg-green-500 hover:bg-green-600',
      text: 'text-green-600',
    },
    securio: {
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      button: 'bg-purple-500 hover:bg-purple-600',
      text: 'text-purple-600',
    },
    taxxy: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      button: 'bg-amber-500 hover:bg-amber-600',
      text: 'text-amber-600',
    },
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -3,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  const handleClick = () => {
    if (!locked) {
      onClick(moduleId, lessonId);
    }
  };
  
  return (
    <motion.div
      className={`rounded-lg shadow-md overflow-hidden border ${
        locked 
          ? 'border-gray-300 opacity-75'
          : current
            ? `border-2 ${characterColors[character].border}`
            : completed
              ? 'border-green-300'
              : characterColors[character].border
      } ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!locked ? "hover" : undefined}
      onClick={handleClick}
    >
      <div className={`p-4 ${
        current 
          ? characterColors[character].bg
          : completed
            ? 'bg-green-50'
            : 'bg-white'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{title}</h3>
          {completed && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Completed
            </span>
          )}
          {current && !completed && (
            <span className={`${characterColors[character].bg} ${characterColors[character].text} text-xs font-medium px-2.5 py-0.5 rounded-full border ${characterColors[character].border}`}>
              Current
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-blue-600">
            +{xpReward} XP
          </div>
          
          {locked ? (
            <div className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Locked</span>
            </div>
          ) : completed ? (
            <button className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">
              Review
            </button>
          ) : (
            <button className={`px-3 py-1 text-white rounded-md text-sm ${characterColors[character].button}`}>
              {current ? 'Continue' : 'Start'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LessonCard;
