import React, { useState } from 'react';

interface InteractiveSimulationProps {
  title: string;
  description: string;
  onComplete: () => void;
  children: React.ReactNode;
}

const InteractiveSimulation: React.FC<InteractiveSimulationProps> = ({
  title,
  description,
  onComplete,
  children,
}) => {
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = () => {
    setIsComplete(true);
    onComplete();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="mb-6 text-gray-600">{description}</p>
      
      <div>
        {children}
      </div>

      {!isComplete && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleComplete}
        >
          Mark as Complete
        </button>
      )}
    </div>
  );
};

export default InteractiveSimulation;