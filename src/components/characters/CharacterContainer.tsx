"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';

export type CharacterType = 'cash' | 'investra' | 'securio' | 'taxxy';
export type EmotionType = 'neutral' | 'happy' | 'sad' | 'excited' | 'confused' | 'thinking';

interface CharacterContainerProps {
  character: CharacterType;
  emotion?: EmotionType;
  speaking?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  onAnimationComplete?: () => void;
}

// This is a placeholder until we have actual Lottie animations
const placeholderAnimations = {
  cash: {
    neutral: { src: '/animations/cash_neutral.json' },
    happy: { src: '/animations/cash_happy.json' },
    sad: { src: '/animations/cash_sad.json' },
    excited: { src: '/animations/cash_excited.json' },
    confused: { src: '/animations/cash_confused.json' },
    thinking: { src: '/animations/cash_thinking.json' },
  },
  investra: {
    neutral: { src: '/animations/investra_neutral.json' },
    happy: { src: '/animations/investra_happy.json' },
    // Other emotions would be defined similarly
  },
  securio: {
    neutral: { src: '/animations/securio_neutral.json' },
    // Other emotions would be defined similarly
  },
  taxxy: {
    neutral: { src: '/animations/taxxy_neutral.json' },
    // Other emotions would be defined similarly
  },
};

// Placeholder animation data for development
const placeholderAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Character Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shape Layer",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { 
          a: 1, 
          k: [
            { t: 0, s: [0], e: [10], i: { x: [0.5], y: [0.5] }, o: { x: [0.5], y: [0.5] } },
            { t: 30, s: [10], e: [0], i: { x: [0.5], y: [0.5] }, o: { x: [0.5], y: [0.5] } },
            { t: 60, s: [0], e: [0], i: { x: [0.5], y: [0.5] }, o: { x: [0.5], y: [0.5] } }
          ], 
          ix: 10 
        },
        p: { a: 0, k: [100, 100, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { 
          a: 1, 
          k: [
            { t: 0, s: [100, 100, 100], e: [110, 110, 100], i: { x: [0.5], y: [0.5] }, o: { x: [0.5], y: [0.5] } },
            { t: 30, s: [110, 110, 100], e: [100, 100, 100], i: { x: [0.5], y: [0.5] }, o: { x: [0.5], y: [0.5] } },
            { t: 60, s: [100, 100, 100], e: [100, 100, 100], i: { x: [0.5], y: [0.5] }, o: { x: [0.5], y: [0.5] } }
          ], 
          ix: 6 
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [100, 100], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.4, 0.6, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform"
            }
          ],
          nm: "Ellipse 1",
          np: 3,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

export const CharacterContainer: React.FC<CharacterContainerProps> = ({
  character,
  emotion = 'neutral',
  speaking = false,
  className,
  size = 'medium',
  onAnimationComplete,
}) => {
  const [animationData, setAnimationData] = useState<any>(placeholderAnimation);
  
  // Size mapping
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-60 h-60',
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
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

  // Speaking animation effect
  const speakingEffect = speaking ? {
    y: [0, -5, 0],
    transition: {
      y: {
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  } : {};

  // In a real implementation, we would load the actual animation file
  // useEffect(() => {
  //   const loadAnimation = async () => {
  //     try {
  //       // In production, we would dynamically import the correct animation file
  //       // const animationPath = placeholderAnimations[character][emotion].src;
  //       // const response = await fetch(animationPath);
  //       // const animationData = await response.json();
  //       // setAnimationData(animationData);
  //     } catch (error) {
  //       console.error('Failed to load animation:', error);
  //     }
  //   };
  //   
  //   loadAnimation();
  // }, [character, emotion]);

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'relative flex items-center justify-center',
          sizeClasses[size],
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        {...speakingEffect}
      >
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          onComplete={onAnimationComplete}
          className="w-full h-full"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default CharacterContainer;
