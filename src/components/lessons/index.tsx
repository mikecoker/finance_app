"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CharacterContainer, CharacterDialog, CharacterGuide } from '@/components/characters';
import { QuizQuestion } from './QuizQuestion';
import { InteractiveCalculator } from './InteractiveCalculator';
import { LessonCompletion } from './LessonCompletion';
import { BankingLessonDemo } from './BankingLessonDemo';

// Export all lesson components for easy imports
export {
  QuizQuestion,
  InteractiveCalculator,
  LessonCompletion,
  BankingLessonDemo
};

// Create a demo component to showcase all lesson components together
interface LessonDemoProps {
  onComplete?: () => void;
}

export const LessonDemo: React.FC<LessonDemoProps> = ({ onComplete }) => {
  const [step, setStep] = React.useState(0);
  
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (onComplete) onComplete();
    }
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
  
  return (
    <motion.div 
      className="max-w-3xl mx-auto p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Interactive Lesson Components</h2>
      
      {step === 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Character Guide Component</h3>
          <CharacterGuide
            character="cash"
            emotion="excited"
            title="Welcome to Banking Fundamentals!"
            instructions="In this lesson, you'll learn about how banks work, different types of accounts, and how to choose the right bank for your needs."
            onContinue={nextStep}
          />
        </div>
      )}
      
      {step === 1 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Character Dialog Component</h3>
          <CharacterDialog
            character="investra"
            emotion="neutral"
            message="Let's talk about investing! When you invest, you're putting your money to work with the goal of growing it over time. This is different from saving, where the primary goal is to preserve your money."
            position="left"
          />
          <button 
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
            onClick={nextStep}
          >
            Next Demo
          </button>
        </div>
      )}
      
      {step === 2 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Quiz Question Component</h3>
          <QuizQuestion
            question="What is the main purpose of a savings account?"
            options={[
              {
                text: "To earn high returns on investments",
                correct: false,
                feedback: "Savings accounts typically offer lower returns than investment accounts."
              },
              {
                text: "To safely store money while earning some interest",
                correct: true,
                feedback: "Correct! Savings accounts are designed to keep your money safe while earning a modest interest rate."
              },
              {
                text: "To pay bills and make daily transactions",
                correct: false,
                feedback: "That's the primary purpose of a checking account, not a savings account."
              },
              {
                text: "To borrow money from the bank",
                correct: false,
                feedback: "Accounts are for depositing your money, not borrowing from the bank."
              }
            ]}
            onAnswer={(index, correct) => {
              setTimeout(() => {
                nextStep();
              }, 2000);
            }}
          />
        </div>
      )}
      
      {step === 3 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Interactive Calculator Component</h3>
          <InteractiveCalculator
            title="Compound Interest Calculator"
            description="See how your money can grow over time with the power of compound interest."
            onComplete={nextStep}
          />
        </div>
      )}
      
      {step === 4 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Lesson Completion Component</h3>
          <LessonCompletion
            character="cash"
            title="Lesson Complete!"
            message="You've completed the Banking Fundamentals lesson. Great job learning about how banks work and different account types!"
            xpEarned={50}
            progressPercentage={45}
            onContinue={onComplete}
          />
        </div>
      )}
    </motion.div>
  );
};

export default {
  QuizQuestion,
  InteractiveCalculator,
  LessonCompletion,
  BankingLessonDemo,
  LessonDemo
};
