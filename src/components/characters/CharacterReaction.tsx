"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CharacterContainer, CharacterType, EmotionType } from './CharacterContainer';
import { cn } from '@/lib/utils';

interface CharacterReactionProps {
  character: CharacterType;
  emotion: EmotionType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  duration?: number;
  onComplete?: () => void;
}

export const CharacterReaction: React.FC<CharacterReactionProps> = ({
  character,
  emotion,
  size = 'medium',
  className,
  duration = 2000,
  onComplete,
}) => {
  const [visible, setVisible] = React.useState(true);
  
  // Auto-hide after duration using requestAnimationFrame instead of setTimeout
  React.useEffect(() => {
    let startTime: number;
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      if (elapsed >= duration) {
        setVisible(false);
        if (onComplete) onComplete();
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [duration, onComplete]);
  
  // Animation variants based on emotion
  const getAnimationVariants = () => {
    switch (emotion) {
      case 'happy':
        return {
          hidden: { opacity: 0, scale: 0.8, y: 20 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
              duration: 0.3,
              ease: "easeOut"
            }
          },
          animate: {
            y: [0, -10, 0, -8, 0],
            rotate: [0, 5, 0, -5, 0],
            transition: {
              duration: 1.5,
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1],
              repeat: 1
            }
          },
          exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: { 
              duration: 0.3,
              ease: "easeIn"
            }
          }
        };
      
      case 'sad':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: 0.3,
              ease: "easeOut"
            }
          },
          animate: {
            y: [0, 5, 0],
            rotate: [0, -3, 0],
            transition: {
              duration: 2,
              ease: "easeInOut",
              repeat: 1
            }
          },
          exit: { 
            opacity: 0, 
            scale: 0.8,
            y: 10,
            transition: { 
              duration: 0.3,
              ease: "easeIn"
            }
          }
        };
      
      case 'excited':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: 0.2,
              ease: "easeOut"
            }
          },
          animate: {
            scale: [1, 1.1, 1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0, 5, 0],
            transition: {
              duration: 1,
              ease: "easeInOut",
              repeat: 2
            }
          },
          exit: { 
            opacity: 0, 
            scale: 1.2,
            transition: { 
              duration: 0.3,
              ease: "easeIn"
            }
          }
        };
      
      case 'confused':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: 0.3,
              ease: "easeOut"
            }
          },
          animate: {
            rotate: [0, 5, -5, 5, 0],
            transition: {
              duration: 1.5,
              ease: "easeInOut",
              repeat: 1
            }
          },
          exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: { 
              duration: 0.3,
              ease: "easeIn"
            }
          }
        };
      
      case 'thinking':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: 0.3,
              ease: "easeOut"
            }
          },
          animate: {
            rotate: [0, 3, 0, 3, 0],
            y: [0, -2, 0, -2, 0],
            transition: {
              duration: 2,
              ease: "easeInOut",
              repeat: 1
            }
          },
          exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: { 
              duration: 0.3,
              ease: "easeIn"
            }
          }
        };
      
      default: // neutral
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: 0.3,
              ease: "easeOut"
            }
          },
          animate: {
            y: [0, -3, 0],
            transition: {
              duration: 2,
              ease: "easeInOut",
              repeat: 1
            }
          },
          exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: { 
              duration: 0.3,
              ease: "easeIn"
            }
          }
        };
    }
  };
  
  const variants = getAnimationVariants();
  
  if (!visible) return null;
  
  return (
    <motion.div
      className={cn(
        'flex items-center justify-center',
        className
      )}
      variants={variants}
      initial="hidden"
      animate={["visible", "animate"]}
      exit="exit"
    >
      <CharacterContainer 
        character={character}
        emotion={emotion}
        size={size}
      />
    </motion.div>
  );
};

export default CharacterReaction;
