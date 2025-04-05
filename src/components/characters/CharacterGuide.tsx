import React from 'react';
import { motion } from 'framer-motion';
import { CharacterContainer, CharacterType, EmotionType } from './CharacterContainer';
import { cn } from '@/lib/utils';

interface CharacterGuideProps {
  character: CharacterType;
  emotion?: EmotionType;
  title: string;
  instructions: string;
  className?: string;
  onContinue?: () => void;
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({
  character,
  emotion = 'neutral',
  title,
  instructions,
  className,
  onContinue,
}) => {
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
  
  // Character color mapping
  const characterColors = {
    cash: 'border-blue-300 bg-blue-50',
    investra: 'border-green-300 bg-green-50',
    securio: 'border-purple-300 bg-purple-50',
    taxxy: 'border-amber-300 bg-amber-50',
  };
  
  return (
    <motion.div
      className={cn(
        'flex flex-col md:flex-row items-center p-4 rounded-xl border-2 shadow-md',
        characterColors[character],
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
        <CharacterContainer 
          character={character}
          emotion={emotion}
          size="medium"
        />
      </div>
      
      <div className="flex-grow">
        <motion.h3 
          className="text-lg md:text-xl font-bold mb-2"
          variants={itemVariants}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-sm md:text-base mb-4"
          variants={itemVariants}
        >
          {instructions}
        </motion.p>
        
        {onContinue && (
          <motion.button
            className={cn(
              'px-4 py-2 rounded-md text-white font-medium',
              character === 'cash' ? 'bg-blue-500 hover:bg-blue-600' :
              character === 'investra' ? 'bg-green-500 hover:bg-green-600' :
              character === 'securio' ? 'bg-purple-500 hover:bg-purple-600' :
              'bg-amber-500 hover:bg-amber-600'
            )}
            onClick={onContinue}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default CharacterGuide;
