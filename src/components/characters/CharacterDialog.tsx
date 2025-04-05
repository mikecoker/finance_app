"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterContainer, CharacterType, EmotionType } from './CharacterContainer';
import { cn } from '@/lib/utils';

interface CharacterDialogProps {
  character: CharacterType;
  emotion?: EmotionType;
  message: string;
  className?: string;
  position?: 'left' | 'right';
  onComplete?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const CharacterDialog: React.FC<CharacterDialogProps> = ({
  character,
  emotion = 'neutral',
  message,
  className,
  position = 'left',
  onComplete,
  autoClose = false,
  autoCloseDelay = 5000,
}) => {
  const [visible, setVisible] = useState(true);
  const [speaking, setSpeaking] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  
  // Text animation speed (characters per second) - INCREASED from 20 to 50
  const textSpeed = 50;
  
  // Auto-close effect
  React.useEffect(() => {
    if (autoClose && visible && displayedText === message) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, displayedText, message, onComplete, visible]);
  
  // Text typing animation effect
  React.useEffect(() => {
    if (currentTextIndex < message.length) {
      // Use requestAnimationFrame instead of setTimeout for smoother animation
      const animationFrame = requestAnimationFrame(() => {
        setDisplayedText(message.substring(0, currentTextIndex + 1));
        setCurrentTextIndex(currentTextIndex + 1);
      });
      
      return () => cancelAnimationFrame(animationFrame);
    } else {
      setSpeaking(false);
    }
  }, [currentTextIndex, message]);
  
  // Dialog bubble variants - REDUCED animation durations
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.15, // REDUCED from 0.3
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      scale: 0.8,
      transition: { 
        duration: 0.1, // REDUCED from 0.2
        ease: "easeIn"
      }
    }
  };
  
  // Position classes
  const positionClasses = {
    container: position === 'left' ? 'flex-row' : 'flex-row-reverse',
    bubble: position === 'left' 
      ? 'ml-2 rounded-tl-none' 
      : 'mr-2 rounded-tr-none'
  };
  
  // Character color mapping
  const characterColors = {
    cash: 'bg-blue-100 border-blue-300',
    investra: 'bg-green-100 border-green-300',
    securio: 'bg-purple-100 border-purple-300',
    taxxy: 'bg-amber-100 border-amber-300',
  };
  
  if (!visible) return null;
  
  return (
    <div className={cn(
      'flex items-end mb-4',
      positionClasses.container,
      className
    )}>
      <CharacterContainer 
        character={character}
        emotion={emotion}
        speaking={speaking}
        size="small"
      />
      
      <motion.div
        className={cn(
          'max-w-xs sm:max-w-sm md:max-w-md p-3 border-2 rounded-xl shadow-md',
          characterColors[character],
          positionClasses.bubble
        )}
        variants={bubbleVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <p className="text-sm md:text-base font-medium">
          {displayedText}
          {speaking && <span className="animate-pulse">|</span>}
        </p>
      </motion.div>
    </div>
  );
};

export default CharacterDialog;
