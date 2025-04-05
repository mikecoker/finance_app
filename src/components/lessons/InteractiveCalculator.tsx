"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface InteractiveCalculatorProps {
  title: string;
  description: string;
  className?: string;
  onComplete?: () => void;
}

export const InteractiveCalculator: React.FC<InteractiveCalculatorProps> = ({
  title,
  description,
  className,
  onComplete
}) => {
  const [principal, setPrincipal] = React.useState<number>(1000);
  const [interestRate, setInterestRate] = React.useState<number>(5);
  const [years, setYears] = React.useState<number>(10);
  const [result, setResult] = React.useState<number | null>(null);
  
  const calculateCompoundInterest = () => {
    const amount = principal * Math.pow(1 + interestRate / 100, years);
    setResult(parseFloat(amount.toFixed(2)));
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
      className={`p-6 bg-white rounded-lg shadow-md ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h3 
        className="text-xl font-bold mb-2"
        variants={itemVariants}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="mb-6 text-gray-600"
        variants={itemVariants}
      >
        {description}
      </motion.p>
      
      <motion.div 
        className="space-y-4 mb-6"
        variants={itemVariants}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Investment (Principal)
          </label>
          <div className="flex items-center">
            <span className="bg-gray-100 px-3 py-2 rounded-l-md border border-r-0 border-gray-300">$</span>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Interest Rate
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.1"
            />
            <span className="bg-gray-100 px-3 py-2 rounded-r-md border border-l-0 border-gray-300">%</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Period
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <span className="bg-gray-100 px-3 py-2 rounded-r-md border border-l-0 border-gray-300">Years</span>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex justify-center mb-6"
        variants={itemVariants}
      >
        <motion.button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={calculateCompoundInterest}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Calculate
        </motion.button>
      </motion.div>
      
      {result !== null && (
        <motion.div
          className="p-4 bg-blue-50 border border-blue-200 rounded-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold mb-2">Result:</h4>
          <p className="text-xl font-bold text-blue-600">${result.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">
            Your investment of ${principal.toLocaleString()} will grow to ${result.toLocaleString()} after {years} years at {interestRate}% interest.
          </p>
          
          {onComplete && (
            <motion.button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default InteractiveCalculator;
