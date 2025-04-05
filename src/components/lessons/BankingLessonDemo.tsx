"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface BankingLessonDemoProps {
  onBackToModule?: () => void;
  onNextLesson?: () => void;
}

export const BankingLessonDemo: React.FC<BankingLessonDemoProps> = ({ onBackToModule, onNextLesson }) => {
  // Simple state management without complex transitions
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionEmotion, setReactionEmotion] = useState<'happy' | 'sad'>('happy');
  
  const lesson = bankingFundamentalsLesson;
  const step = lesson[currentStep];
  
  // Simple event-based handlers without timeouts
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
    const isCorrect = step.options && step.options[index].correct;
    setReactionEmotion(isCorrect ? 'happy' : 'sad');
    setShowReaction(true);
    
    // Use requestAnimationFrame instead of setTimeout for animation
    requestAnimationFrame(() => {
      // This will run in the next animation frame, giving time for the reaction to show
      requestAnimationFrame(() => {
        // And this will run in the frame after that, giving enough time for the animation
        setShowReaction(false);
      });
    });
  };

  const handleBackToModules = () => {
    if (onBackToModule) {
      onBackToModule();
    } else {
      // Fallback if no handler is provided
      window.location.href = '/course';
    }
  };
  
  // Simplified animation variants
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  // Render different components based on step type
  const renderStepContent = () => {
    switch (step.type) {
      case 'intro':
        return (
          <CharacterGuide
            key={`intro-${currentStep}`}
            character={step.character}
            emotion="excited"
            title={step.title}
            instructions={step.content}
            onContinue={handleNextStep}
          />
        );
        
      case 'content':
        return (
          <div className="mb-6" key={`content-${currentStep}`}>
            <CharacterDialog
              character={step.character}
              message={step.content}
              autoClose={false}
            />
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
              onClick={handleNextStep}
            >
              Continue
            </button>
          </div>
        );
        
      case 'quiz':
        return (
          <div className="mb-6" key={`quiz-${currentStep}`}>
            <div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="mb-4">{step.content}</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {step.options?.map((option, index) => (
                <button
                  key={`option-${index}`}
                  className={`w-full p-3 text-left rounded-md border ${
                    selectedOption === index 
                      ? option.correct 
                        ? 'bg-green-100 border-green-500' 
                        : 'bg-red-100 border-red-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showFeedback}
                >
                  {option.text}
                </button>
              ))}
            </div>
            
            {showFeedback && selectedOption !== null && (
              <div
                className={`p-4 rounded-md mb-4 ${
                  step.options?.[selectedOption].correct
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p>{step.options?.[selectedOption].feedback}</p>
              </div>
            )}
            
            {showFeedback && (
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
                onClick={handleNextStep}
              >
                Continue
              </button>
            )}
          </div>
        );
        
      case 'interactive':
        return (
          <div className="mb-6" key={`interactive-${currentStep}`}>
            <div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="mb-4">{step.content}</p>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 mb-6">
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
              
              <div className="text-center mb-6">
                <p className="mb-2">When you deposit $1,000 in the bank:</p>
                <ul className="text-left max-w-md mx-auto space-y-2">
                  <li>• You earn interest (e.g., $10 per year at 1%)</li>
                  <li>• The bank lends $900 to a home buyer at 4% ($36 per year)</li>
                  <li>• The bank keeps $100 as a reserve</li>
                  <li>• The bank makes $26 profit ($36 - $10)</li>
                </ul>
              </div>
            </div>
            
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
              onClick={handleNextStep}
            >
              Continue
            </button>
          </div>
        );
        
      case 'application':
        return (
          <div className="mb-6" key={`application-${currentStep}`}>
            <div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="mb-4">{step.content}</p>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 mb-6">
              <h4 className="font-semibold mb-3">Consider these questions:</h4>
              <ul className="space-y-2 mb-4">
                <li>1. Do you need frequent access to your money?</li>
                <li>2. Are you looking to earn interest on your savings?</li>
                <li>3. Do you want to avoid monthly fees?</li>
                <li>4. Do you need in-person banking services or is online banking sufficient?</li>
              </ul>
              
              <p className="text-sm text-gray-600 italic">
                Think about these questions as you consider your banking needs. In future lessons, we'll explore different account types in detail.
              </p>
            </div>
            
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
              onClick={handleNextStep}
            >
              Continue
            </button>
          </div>
        );
        
      case 'complete':
        return (
          <div className="mb-6" key={`complete-${currentStep}`}>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="mb-4">{step.content}</p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h4 className="font-semibold mb-2">You've earned:</h4>
                <p className="text-xl font-bold text-blue-600">+50 XP</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <p className="text-sm mt-1">20% of module complete</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={handleBackToModules}
              >
                Back to Module
              </button>
              
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => {
                  // Navigate to the next lesson if handler is provided
                  if (onNextLesson) {
                    onNextLesson();
                  } else {
                    // Fallback to module view if no handler
                    handleBackToModules();
                  }
                }}
              >
                Next Lesson
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Lesson Progress</span>
          <span>{currentStep + 1} of {lesson.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentStep + 1) / lesson.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Character reaction overlay */}
      {showReaction && (
        <CharacterReaction
          character="cash"
          emotion={reactionEmotion}
        />
      )}
      
      {/* Main content */}
      {renderStepContent()}
    </div>
  );
};

// Export the component as default as well
export default BankingLessonDemo;
