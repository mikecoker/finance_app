"use client";

import React from 'react';
import { CharacterContainer } from './CharacterContainer';
import { CharacterDialog } from './CharacterDialog';
import { CharacterReaction } from './CharacterReaction';
import { CharacterGuide } from './CharacterGuide';

// Export all character components for easy imports
export {
  CharacterContainer,
  CharacterDialog,
  CharacterReaction,
  CharacterGuide
};

// Re-export types
export type { 
  CharacterType, 
  EmotionType 
} from './CharacterContainer';

// Create a demo component to showcase all character components
interface CharacterDemoProps {
  onComplete?: () => void;
}

export const CharacterDemo: React.FC<CharacterDemoProps> = ({ onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [showReaction, setShowReaction] = React.useState(false);
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (onComplete) onComplete();
    }
  };
  
  const handleShowReaction = () => {
    setShowReaction(true);
    setTimeout(() => {
      setShowReaction(false);
    }, 3000);
  };
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Character Animation System Demo</h2>
      
      {step === 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Character Container</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="flex flex-col items-center">
              <CharacterContainer character="cash" emotion="neutral" />
              <p className="mt-2 text-sm">Cash (Neutral)</p>
            </div>
            <div className="flex flex-col items-center">
              <CharacterContainer character="investra" emotion="happy" />
              <p className="mt-2 text-sm">Investra (Happy)</p>
            </div>
            <div className="flex flex-col items-center">
              <CharacterContainer character="securio" emotion="thinking" />
              <p className="mt-2 text-sm">Securio (Thinking)</p>
            </div>
            <div className="flex flex-col items-center">
              <CharacterContainer character="taxxy" emotion="confused" />
              <p className="mt-2 text-sm">Taxxy (Confused)</p>
            </div>
          </div>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
            onClick={nextStep}
          >
            Next Demo
          </button>
        </div>
      )}
      
      {step === 1 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Character Dialog</h3>
          <div className="space-y-4">
            <CharacterDialog 
              character="cash" 
              emotion="neutral"
              message="Hi there! I'm Cash, your guide to banking and budgeting. I'll help you understand how money works!"
              position="left"
            />
            <CharacterDialog 
              character="investra" 
              emotion="excited"
              message="Hello! I'm Investra and I'm passionate about investments. I'll show you how to grow your money over time!"
              position="right"
            />
          </div>
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
          <h3 className="text-lg font-semibold mb-4">Character Reaction</h3>
          <div className="flex flex-col items-center">
            <p className="mb-4">Click the button to see different character reactions:</p>
            <button 
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 mb-6"
              onClick={handleShowReaction}
            >
              Show Reaction
            </button>
            
            {showReaction && (
              <div className="flex justify-center">
                <CharacterReaction 
                  character="securio" 
                  emotion="excited"
                  size="large"
                />
              </div>
            )}
          </div>
          <button 
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mx-auto block"
            onClick={nextStep}
          >
            Next Demo
          </button>
        </div>
      )}
      
      {step === 3 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Character Guide</h3>
          <CharacterGuide 
            character="taxxy"
            emotion="thinking"
            title="Understanding Tax Deductions"
            instructions="Tax deductions reduce your taxable income, potentially lowering the amount of tax you owe. Let's explore some common deductions you might be eligible for."
            onContinue={onComplete}
          />
        </div>
      )}
    </div>
  );
};

export default {
  CharacterContainer,
  CharacterDialog,
  CharacterReaction,
  CharacterGuide,
  CharacterDemo
};
