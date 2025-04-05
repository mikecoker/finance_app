import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CharacterContainer, 
  CharacterDialog, 
  CharacterGuide,
  CharacterReaction,
  CharacterType
} from '@/components/characters';

// Define the lesson content structure
interface LessonStep {
  type: 'intro' | 'content' | 'quiz' | 'interactive' | 'application' | 'complete';
  character: CharacterType;
  title: string;
  content: string;
  options?: {
    text: string;
    correct?: boolean;
    feedback: string;
  }[];
}

// Sample lesson on Banking Fundamentals
const bankingFundamentalsLesson: LessonStep[] = [
  {
    type: 'intro',
    character: 'cash',
    title: 'Introduction to Banking',
    content: 'Welcome to your first lesson on Banking Fundamentals! I\'m Cash, and I\'ll be your guide as we explore how banks work and why they\'re important for your financial life.'
  },
  {
    type: 'content',
    character: 'cash',
    title: 'What is a Bank?',
    content: 'A bank is a financial institution that accepts deposits, provides loans, and offers various financial services. Banks play a crucial role in the economy by safely storing money, facilitating payments, and helping money flow through the economy.'
  },
  {
    type: 'content',
    character: 'cash',
    title: 'How Banks Make Money',
    content: 'Banks primarily make money through interest on loans. They pay you a small interest rate on your deposits (like 1%) and then lend that money to others at a higher rate (like 5%). The difference, called the spread, is how banks generate profit.'
  },
  {
    type: 'quiz',
    character: 'cash',
    title: 'Quick Check',
    content: 'What is the main way banks make money?',
    options: [
      {
        text: 'Charging monthly account fees',
        correct: false,
        feedback: 'While banks do charge fees, this isn\'t their primary source of income.'
      },
      {
        text: 'Interest on loans',
        correct: true,
        feedback: 'Correct! Banks make most of their money from the interest spread between what they pay depositors and what they charge borrowers.'
      },
      {
        text: 'Investing in the stock market',
        correct: false,
        feedback: 'Banks do invest, but this isn\'t their main business model.'
      },
      {
        text: 'ATM withdrawal fees',
        correct: false,
        feedback: 'Fees are a revenue source, but they\'re secondary to interest income.'
      }
    ]
  },
  {
    type: 'interactive',
    character: 'cash',
    title: 'Banking Cycle Simulation',
    content: 'Let\'s see how money flows through the banking system. In this simulation, you\'ll deposit money, the bank will lend it out, and you\'ll see how everyone benefits.'
  },
  {
    type: 'application',
    character: 'cash',
    title: 'Real-World Application',
    content: 'Now that you understand how banks work, let\'s think about your own banking relationship. Consider what type of account might be best for your needs and what features would be most important to you.'
  },
  {
    type: 'complete',
    character: 'cash',
    title: 'Lesson Complete!',
    content: 'Great job! You\'ve completed the introduction to banking. You now understand the basic function of banks and how they make money. In the next lesson, we\'ll explore different types of bank accounts.'
  }
];

const BankingLessonDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionEmotion, setReactionEmotion] = useState<'happy' | 'sad'>('happy');
  
  const lesson = bankingFundamentalsLesson;
  const step = lesson[currentStep];
  
  const handleNextStep = () => {
    if (currentStep < lesson.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };
  
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowFeedback(true);
    
    // Show appropriate reaction based on correctness
    if (step.options && step.options[index].correct) {
      setReactionEmotion('happy');
    } else {
      setReactionEmotion('sad');
    }
    
    setShowReaction(true);
    setTimeout(() => {
      setShowReaction(false);
    }, 2000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
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
        duration: 0.3
      }
    }
  };
  
  // Render different components based on step type
  const renderStepContent = () => {
    switch (step.type) {
      case 'intro':
        return (
          <CharacterGuide
            character={step.character}
            emotion="excited"
            title={step.title}
            instructions={step.content}
            onContinue={handleNextStep}
          />
        );
        
      case 'content':
        return (
          <div className="mb-6">
            <CharacterDialog
              character={step.character}
              message={step.content}
              autoClose={false}
            />
            <motion.button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
              onClick={handleNextStep}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </div>
        );
        
      case 'quiz':
        return (
          <div className="mb-6">
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="mb-4">{step.content}</p>
            </motion.div>
            
            <motion.div 
              className="space-y-3 mb-6"
              variants={itemVariants}
            >
              {step.options?.map((option, index) => (
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
                  whileHover={!showFeedback ? { scale: 1.02 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                >
                  {option.text}
                </motion.button>
              ))}
            </motion.div>
            
            {showFeedback && selectedOption !== null && (
              <motion.div
                className={`p-4 rounded-md mb-4 ${
                  step.options?.[selectedOption].correct
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p>{step.options?.[selectedOption].feedback}</p>
              </motion.div>
            )}
            
            {showFeedback && (
              <motion.button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
                onClick={handleNextStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            )}
          </div>
        );
        
      case 'interactive':
        // In a real implementation, this would be a more complex interactive component
        return (
          <div className="mb-6">
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="mb-4">{step.content}</p>
            </motion.div>
            
            <motion.div 
              className="border border-gray-300 rounded-lg p-6 bg-gray-50 mb-6"
              variants={itemVariants}
            >
              <div className="flex flex-col md:flex-row items-center justify-around gap-4 mb-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl">👤</span>
                  </div>
                  <p className="font-medium">You</p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl">🏦</span>
                  </div>
                  <p className="font-medium">Bank</p>
                </div>
                
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <p className="font-medium">Borrower</p>
                </div>
              </div>
              
              <div className="flex justify-center mb-4">
                <motion.button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Simulate Banking Cycle
                </motion.button>
              </div>
              
              <p className="text-center text-sm text-gray-500">
                (This is a placeholder for an interactive banking cycle simulation)
              </p>
            </motion.div>
            
            <motion.button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
              onClick={handleNextStep}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </div>
        );
        
      case 'application':
        return (
          <div className="mb-6">
            <CharacterDialog
              character={step.character}
              message={step.content}
              autoClose={false}
            />
            
            <motion.div 
              className="border border-gray-300 rounded-lg p-6 bg-gray-50 mt-6 mb-6"
              variants={itemVariants}
            >
              <h4 className="font-semibold mb-2">Reflection Questions:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>What features do you need in a bank account? (e.g., mobile banking, low fees)</li>
                <li>How often do you need to withdraw cash?</li>
                <li>Do you need to earn interest on your balance?</li>
                <li>Would you prefer a local bank or an online bank?</li>
              </ul>
            </motion.div>
            
            <motion.button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
              onClick={handleNextStep}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </div>
        );
        
      case 'complete':
        return (
          <div className="mb-6 text-center">
            <motion.div 
              className="mb-6"
              variants={itemVariants}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p>{step.content}</p>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              variants={itemVariants}
            >
              <h4 className="font-semibold mb-2">You've earned:</h4>
              <p className="text-xl font-bold text-blue-600">+50 XP</p>
              <div className="flex items-center justify-center mt-2">
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="ml-2 text-sm">45%</span>
              </div>
            </motion.div>
            
            <motion.button
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 mx-auto"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Modules
            </motion.button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold">Banking Fundamentals</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${(currentStep / (lesson.length - 1)) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Lesson {currentStep + 1} of {lesson.length}
          </p>
        </motion.div>
        
        {renderStepContent()}
        
        {showReaction && (
          <div className="fixed bottom-4 right-4">
            <CharacterReaction
              character={step.character}
              emotion={reactionEmotion}
              size="medium"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BankingLessonDemo;
