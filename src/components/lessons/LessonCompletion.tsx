import React from 'react';
import { motion } from 'framer-motion';
import { CharacterType } from '@/components/characters';

interface LessonCompletionProps {
  character: CharacterType;
  title: string;
  message: string;
  xpEarned: number;
  progressPercentage: number;
  onContinue?: () => void;
  className?: string;
}

export const LessonCompletion: React.FC<LessonCompletionProps> = ({
  character,
  title,
  message,
  xpEarned,
  progressPercentage,
  onContinue,
  className,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
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
  
  const characterColors = {
    cash: 'bg-blue-500 hover:bg-blue-600',
    investra: 'bg-green-500 hover:bg-green-600',
    securio: 'bg-purple-500 hover:bg-purple-600',
    taxxy: 'bg-amber-500 hover:bg-amber-600',
  };
  
  return (
    <motion.div
      className={`p-6 bg-white rounded-xl shadow-lg text-center ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <motion.span 
            className="text-4xl"
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              transition: { 
                delay: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 10
              }
            }}
          >
            ✅
          </motion.span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </motion.div>
      
      <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6"
        variants={itemVariants}
      >
        <h3 className="font-semibold mb-2">You've earned:</h3>
        <motion.p 
          className="text-2xl font-bold text-blue-600 mb-3"
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.2, 1],
            transition: { 
              delay: 0.5,
              duration: 0.6,
              times: [0, 0.5, 1]
            }
          }}
        >
          +{xpEarned} XP
        </motion.p>
        
        <div className="flex items-center justify-center mt-2">
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-3">
            <motion.div 
              className="bg-blue-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${progressPercentage}%`,
                transition: { 
                  delay: 0.7,
                  duration: 1,
                  ease: "easeOut"
                }
              }}
            ></motion.div>
          </div>
          <span className="ml-2 text-sm">{progressPercentage}%</span>
        </div>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center space-y-3"
      >
        <motion.div
          className="flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 1.2 }
          }}
        >
          <span className="text-yellow-500 text-2xl">🔥</span>
          <span className="font-bold">Streak: 3 days</span>
        </motion.div>
        
        {onContinue && (
          <motion.button
            className={`mt-4 px-6 py-3 text-white rounded-md font-medium ${characterColors[character]}`}
            onClick={onContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue to Next Lesson
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LessonCompletion;
