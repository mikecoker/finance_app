import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from './ProgressProvider';

interface ProgressBarProps {
  moduleId?: string;
  lessonId?: string;
  className?: string;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  moduleId,
  lessonId,
  className,
  showPercentage = true,
  height = 'md',
  color = 'blue',
}) => {
  const { getModuleProgress, getLessonProgress, getUserLevel } = useProgress();
  
  // Determine percentage based on what we're tracking
  let percentage = 0;
  let label = '';
  
  if (moduleId && lessonId) {
    // Lesson progress
    const lessonProgress = getLessonProgress(moduleId, lessonId);
    percentage = lessonProgress?.completionPercentage || 0;
    label = `Lesson Progress`;
  } else if (moduleId) {
    // Module progress
    const moduleProgress = getModuleProgress(moduleId);
    percentage = moduleProgress?.completionPercentage || 0;
    label = `Module Progress`;
  } else {
    // Overall user level progress
    const levelInfo = getUserLevel();
    percentage = levelInfo.percentage;
    label = `Level ${levelInfo.level} Progress`;
  }
  
  // Height classes
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };
  
  // Color classes
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-600',
  };
  
  // Animation variants
  const barVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${percentage}%`,
      transition: { 
        duration: 1,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className={`${className}`}>
      {label && showPercentage && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-gray-500">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[height]}`}>
        <motion.div 
          className={`${heightClasses[height]} rounded-full ${colorClasses[color]}`}
          variants={barVariants}
          initial="hidden"
          animate="visible"
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
