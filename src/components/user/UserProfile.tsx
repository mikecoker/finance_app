import React from 'react';
import { motion } from 'framer-motion';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
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
  
  if (!isLoaded) {
    return (
      <div className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return (
      <motion.div 
        className={`p-4 bg-white rounded-lg shadow-md ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <p className="mb-3">Sign in to track your progress</p>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Sign In
            </button>
          </SignInButton>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className={`p-4 bg-white rounded-lg shadow-md ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center mb-4">
        <UserButton />
        <motion.div variants={itemVariants} className="ml-3">
          <p className="font-medium">{user.fullName || user.username}</p>
          <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants} className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Level 3</span>
          <span className="text-sm text-gray-500">250 XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-yellow-500 text-xl">🔥</span>
          <span className="ml-1 font-medium">3 day streak</span>
        </div>
        <button className="text-sm text-blue-500 hover:text-blue-700">View Profile</button>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;
