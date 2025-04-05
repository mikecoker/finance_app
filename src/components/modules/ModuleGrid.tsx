import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ModuleCard, Module } from './ModuleCard';
import { CharacterGuide } from '@/components/characters';

interface ModuleGridProps {
  modules: Module[];
  onModuleSelect: (moduleId: string) => void;
  className?: string;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  modules,
  onModuleSelect,
  className,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  // Filter modules by level if a level is selected
  const filteredModules = selectedLevel 
    ? modules.filter(module => module.level === selectedLevel)
    : modules;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  // Get unique levels from modules
  const levels = Array.from(new Set(modules.map(module => module.level)));
  
  return (
    <motion.div
      className={`${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6">
        <CharacterGuide
          character="cash"
          emotion="excited"
          title="Personal Finance Course Modules"
          instructions="Select a module to begin learning. Complete foundation modules first to unlock more advanced topics."
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedLevel === null 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedLevel(null)}
        >
          All Levels
        </button>
        
        {levels.map(level => (
          <button
            key={level}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedLevel === level
                ? level === 'foundation' ? 'bg-blue-500 text-white' :
                  level === 'intermediate' ? 'bg-cyan-500 text-white' :
                  level === 'advanced' ? 'bg-teal-500 text-white' :
                  'bg-amber-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            onClick={onModuleSelect}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ModuleGrid;
