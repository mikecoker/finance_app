"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
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
    <main className="min-h-screen bg-gray-50">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Personal Finance Course</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master your finances with our interactive, character-guided learning experience
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-16"
          variants={itemVariants}
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <span className="text-7xl">🎓</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Comprehensive Curriculum</h2>
              <p className="text-gray-600 mb-4">
                From banking basics to advanced investing, our course covers every aspect of personal finance with engaging, interactive lessons.
              </p>
              <Link href="/course">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Start Learning
                </button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <span className="text-7xl">🤖</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Character-Guided Learning</h2>
              <p className="text-gray-600 mb-4">
                Meet our financial guide characters who make learning fun and engaging with interactive animations and personalized feedback.
              </p>
              <Link href="/demo">
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  View Demo
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl shadow-md p-8 mb-16"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Course Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 className="font-bold mb-2">Banking Fundamentals</h3>
              <p className="text-sm text-gray-600">Learn how banks work and how to choose the right accounts</p>
            </div>
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="font-bold mb-2">Budgeting Basics</h3>
              <p className="text-sm text-gray-600">Master creating and maintaining a personal budget</p>
            </div>
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <h3 className="font-bold mb-2">Credit Cards 101</h3>
              <p className="text-sm text-gray-600">Understand credit cards and how to use them responsibly</p>
            </div>
            <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
              <h3 className="font-bold mb-2">Tax Essentials</h3>
              <p className="text-sm text-gray-600">Learn about income tax, deductions, and credits</p>
            </div>
            <div className="border border-cyan-200 rounded-lg p-4 bg-cyan-50">
              <h3 className="font-bold mb-2">Investing Basics</h3>
              <p className="text-sm text-gray-600">Start building your investment portfolio</p>
            </div>
            <div className="border border-teal-200 rounded-lg p-4 bg-teal-50">
              <h3 className="font-bold mb-2">Retirement Planning</h3>
              <p className="text-sm text-gray-600">Prepare for your future with retirement strategies</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link href="/course">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium">
                Explore All Modules
              </button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold mb-4">Ready to master your finances?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of learners who have transformed their financial future with our interactive course.
          </p>
          <Link href="/course">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-bold text-lg shadow-lg">
              Get Started Now
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
