import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CharacterType } from '@/components/characters';

// Define module types
export interface Module {
  id: string;
  title: string;
  description: string;
  character: CharacterType;
  level: 'foundation' | 'intermediate' | 'advanced' | 'mastery';
  lessons: number;
  completedLessons: number;
  xpReward: number;
  prerequisites: string[];
  unlocked: boolean;
}

interface ModuleCardProps {
  module: Module;
  onClick?: (moduleId: string) => void;
  className?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onClick,
  className,
}) => {
  // Character color mapping
  const characterColors = {
    cash: {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      button: 'bg-blue-500 hover:bg-blue-600',
      progress: 'bg-blue-500',
    },
    investra: {
      bg: 'bg-green-100',
      border: 'border-green-300',
      button: 'bg-green-500 hover:bg-green-600',
      progress: 'bg-green-500',
    },
    securio: {
      bg: 'bg-purple-100',
      border: 'border-purple-300',
      button: 'bg-purple-500 hover:bg-purple-600',
      progress: 'bg-purple-500',
    },
    taxxy: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      button: 'bg-amber-500 hover:bg-amber-600',
      progress: 'bg-amber-500',
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
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  const handleClick = () => {
    if (onClick && module.unlocked) {
      onClick(module.id);
    }
  };
  
  return (
    <motion.div
      className={`rounded-xl shadow-md overflow-hidden border ${
        module.unlocked 
          ? characterColors[module.character].border
          : 'border-gray-300 opacity-75'
      } ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={module.unlocked ? "hover" : undefined}
      onClick={handleClick}
    >
      <div className={`p-4 ${characterColors[module.character].bg}`}>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{module.title}</h3>
          <span className={`text-xs font-medium text-white px-2 py-1 rounded-full ${levelColors[module.level]}`}>
            {module.level.charAt(0).toUpperCase() + module.level.slice(1)}
          </span>
        </div>
        <p className="text-sm mt-1 text-gray-700">{module.description}</p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm">
            <span className="font-medium">{module.completedLessons}</span>
            <span className="text-gray-500">/{module.lessons} lessons</span>
          </div>
          <div className="text-sm font-medium text-blue-600">
            +{module.xpReward} XP
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full ${characterColors[module.character].progress}`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {!module.unlocked ? (
          <div className="flex items-center justify-center text-gray-500 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Complete prerequisites to unlock</span>
          </div>
        ) : (
          <button 
            className={`w-full py-2 text-white rounded-md font-medium ${characterColors[module.character].button}`}
            disabled={!module.unlocked}
          >
            {module.completedLessons > 0 ? 'Continue' : 'Start Module'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ModuleCard;
