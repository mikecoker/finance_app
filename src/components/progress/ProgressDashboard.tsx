import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from './ProgressProvider';

interface ProgressDashboardProps {
  className?: string;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  className,
}) => {
  const { 
    userProgress, 
    isLoading, 
    getUserLevel 
  } = useProgress();
  
  if (isLoading) {
    return (
      <div className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (!userProgress) {
    return (
      <div className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
        <p className="text-gray-500">No progress data available.</p>
      </div>
    );
  }
  
  const { level, xp, nextLevelXp, percentage } = getUserLevel();
  
  // Count modules by status
  const moduleStatuses = {
    completed: 0,
    in_progress: 0,
    available: 0,
    locked: 0,
  };
  
  Object.values(userProgress.moduleProgress).forEach(module => {
    moduleStatuses[module.status] += 1;
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.div
      className={`p-4 bg-white rounded-lg shadow-md ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 
        className="text-xl font-bold mb-4"
        variants={itemVariants}
      >
        Your Progress
      </motion.h3>
      
      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Level {level}</span>
          <span className="text-sm text-gray-500">{xp} / {nextLevelXp} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-blue-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${percentage}%`,
              transition: { duration: 1, ease: "easeOut" }
            }}
          ></motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center">
          <span className="text-yellow-500 text-xl">🔥</span>
          <span className="ml-1 font-medium">{userProgress.streak.current} day streak</span>
        </div>
        <span className="text-sm text-gray-500">Last active: {userProgress.streak.lastActivity}</span>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <h4 className="font-medium mb-2">Module Progress</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="text-2xl font-bold text-green-600">{moduleStatuses.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="text-2xl font-bold text-blue-600">{moduleStatuses.in_progress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="text-2xl font-bold text-amber-600">{moduleStatuses.available}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <div className="text-2xl font-bold text-gray-600">{moduleStatuses.locked}</div>
            <div className="text-sm text-gray-600">Locked</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressDashboard;
