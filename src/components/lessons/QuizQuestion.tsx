"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface QuizQuestionProps {
  question: string;
  options: {
    text: string;
    correct?: boolean;
    feedback: string;
  }[];
  onAnswer: (index: number, correct: boolean) => void;
  className?: string;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  onAnswer,
  className,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  
  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null || showFeedback) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
    const isCorrect = options[index].correct === true;
    onAnswer(index, isCorrect);
  };
  
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
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
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
      exit="exit"
    >
      <motion.h3 
        className="text-xl font-bold mb-4"
        variants={itemVariants}
      >
        {question}
      </motion.h3>
      
      <motion.div 
        className="space-y-3 mb-4"
        variants={itemVariants}
      >
        {options.map((option, index) => (
          <motion.button
            key={index}
            className={`w-full p-3 text-left rounded-md border ${
              selectedOption === index 
                ? option.correct 
                  ? 'bg-green-100 border-green-500' 
                  : 'bg-red-100 border-red-500'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleOptionSelect(index)}
            disabled={showFeedback}
            variants={itemVariants}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
          >
            {option.text}
          </motion.button>
        ))}
      </motion.div>
      
      {showFeedback && selectedOption !== null && (
        <motion.div
          className={`p-4 rounded-md ${
            options[selectedOption].correct
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>{options[selectedOption].feedback}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizQuestion;
