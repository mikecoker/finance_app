import React from 'react';
import { motion } from 'framer-motion';
import { CharacterDemo } from '@/components/characters';
import { LessonDemo } from '@/components/lessons';

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = React.useState<'character' | 'lesson' | null>(null);
  
  const handleDemoComplete = () => {
    setActiveDemo(null);
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
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <motion.div 
        className="max-w-4xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          variants={itemVariants}
        >
          Interactive Demo
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 text-center mb-8"
          variants={itemVariants}
        >
          Experience our animated characters and interactive lesson components
        </motion.p>
        
        {!activeDemo ? (
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-blue-100 flex items-center justify-center">
                <span className="text-6xl">🎭</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Character Animation System</h2>
                <p className="text-gray-600 mb-4">
                  Explore our animated financial guide characters that make learning engaging and fun.
                </p>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => setActiveDemo('character')}
                >
                  View Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="h-40 bg-green-100 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">Interactive Lesson Components</h2>
                <p className="text-gray-600 mb-4">
                  Experience our Duolingo-style lesson components with quizzes, calculators, and more.
                </p>
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => setActiveDemo('lesson')}
                >
                  View Demo
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button 
              className="mb-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
              onClick={handleDemoComplete}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Demo Menu
            </button>
            
            {activeDemo === 'character' ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <CharacterDemo onComplete={handleDemoComplete} />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6">
                <LessonDemo onComplete={handleDemoComplete} />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
