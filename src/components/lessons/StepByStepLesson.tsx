"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CharacterContainer, 
  CharacterDialog, 
  CharacterGuide,
  CharacterReaction,
  CharacterType
} from '@/components/characters';
import { LessonStep } from '@/services/dataService';
import { useProgress } from '@/components/progress/ProgressProvider';
import BudgetSimulator from './interactive/BudgetSimulator';

interface StepByStepLessonProps {
  lessonContent: LessonStep[];
  onBackToModule: () => void;
  onNextLesson: () => void;
  lessonTitle: string;
  moduleId?: string;
  lessonId?: string;
}

export const StepByStepLesson: React.FC<StepByStepLessonProps> = ({ 
  lessonContent, 
  onBackToModule, 
  onNextLesson,
  lessonTitle,
  moduleId,
  lessonId
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionEmotion, setReactionEmotion] = useState<'happy' | 'sad'>('happy');
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  
  // Get progress tracking functions
  const { updateLessonProgress } = useProgress();
  
  // Reset step counter ONLY when switching to a different lesson
  useEffect(() => {
    // Create a unique identifier for the current lesson
    const lessonIdentifier = `${lessonTitle}-${lessonContent.length}`;
    
    // Only reset if we're switching to a different lesson
    if (currentLessonId !== lessonIdentifier && currentLessonId !== '') {
      setCurrentStep(0);
      setSelectedOption(null);
      setShowFeedback(false);
    }
    
    // Update the current lesson identifier
    setCurrentLessonId(lessonIdentifier);
  }, [lessonContent, lessonTitle, currentLessonId]);
  
  const step = lessonContent[currentStep];
  
  // Event-based handlers
  const handleNextStep = () => {
    if (moduleId && lessonId && currentStep < lessonContent.length - 1) {
      // Calculate completion percentage based on current step
      const completionPercentage = Math.round(((currentStep + 1) / lessonContent.length) * 100);
      
      // Update lesson progress in the progress tracking system
      updateLessonProgress(moduleId, lessonId, {
        completionPercentage,
        status: 'in_progress'
      });
      
      // Move to next step
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // If this was the last step, go to next lesson
      onNextLesson();
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
      requestAnimationFrame(() => {
        setShowReaction(false);
      });
    });
  };
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  // Render different components based on step type
  const renderStepContent = () => {
    if (!step) return null;
    
    switch (step.type) {
      case 'intro':
        return (
          <div className="mb-6" key={`intro-${currentStep}`}>
            <CharacterDialog
              character={step.character as any}
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
        
      case 'content':
        return (
          <div className="mb-6" key={`content-${currentStep}`}>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p>{step.content}</p>
            </div>
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
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="mb-4">{step.content}</p>
            
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
            </div>
            
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
        // Render specific interactive components based on lessonId
        if (lessonId === 'budgeting-intro') { // Example: Check for a specific budgeting lesson ID
          return (
            <div className="mb-6" key={`interactive-${currentStep}`}>
              <BudgetSimulator onComplete={handleNextStep} config={step.interactiveConfig} />
            </div>
          );
        } else {
          // Default rendering for other interactive types
          return (
            <div className="mb-6" key={`interactive-${currentStep}`}>
              <div className={`border rounded-lg p-4 border-purple-200 bg-purple-50`}>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p>{step.content}</p>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
                onClick={handleNextStep}
              >
                Continue
              </button>
            </div>
          );
        }

      case 'application':
        return (
          <div className="mb-6" key={`application-${currentStep}`}>
            <div className={`border rounded-lg p-4 border-green-200 bg-green-50`}>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p>{step.content}</p>
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
            <div className="border border-green-300 rounded-lg p-4 bg-green-50">
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p>{step.content}</p>
            </div>
            <div className="flex justify-between mt-8">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={onBackToModule}
              >
                Back to Module
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={onNextLesson}
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
  
  // Progress indicator
  const progressPercentage = ((currentStep + 1) / lessonContent.length) * 100;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{lessonTitle}</h2>
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {lessonContent.length}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 h-2 mb-6 rounded-full">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Character reaction animation */}
      {showReaction && (
        <div className="fixed top-1/4 right-10 z-50">
          <CharacterReaction 
            character="cash"
            emotion={reactionEmotion}
          />
        </div>
      )}
      
      {/* Main content area */}
      <motion.div
        key={`step-${currentStep}`}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        transition={{ duration: 0.3 }}
        className="min-h-[300px]"
      >
        {renderStepContent()}
      </motion.div>
    </div>
  );
};

export default StepByStepLesson;
