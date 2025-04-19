import React, { useState } from 'react';
import InteractiveSimulation from './InteractiveSimulation';
import { Slider } from '@/components/ui/slider'; // Import the Slider component

interface BudgetSimulatorProps {
  onComplete: () => void;
  config?: {
    initialIncome?: number;
    initialCategories?: { [key: string]: number };
  };
}

const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({ onComplete, config }) => {
  const [income, setIncome] = useState(config?.initialIncome || 3000);
  const [categories, setCategories] = useState(config?.initialCategories || {
    housing: 1000,
    food: 400,
    transportation: 200,
    utilities: 150,
    savings: 500,
    other: 750,
  });

  const handleSliderChange = (category: string, value: number[]) => {
    setCategories({
      ...categories,
      [category]: value[0],
    });
  };

  const handleInputChange = (category: string, value: number) => {
    setCategories({
      ...categories,
      [category]: value,
    });
  };


  const totalAllocated = Object.values(categories).reduce((sum, value) => sum + value, 0);
  const remaining = income - totalAllocated;

  return (
    <InteractiveSimulation
      title="Monthly Budget Simulator"
      description="Allocate your income to different categories using the sliders and see how it balances out."
      onComplete={onComplete}
    >
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <label className="block text-sm font-medium text-blue-700 mb-2">Monthly Income</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          min="0"
        />
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([category, value]) => (
          <div key={category} className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 capitalize mb-3">{category}</label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[value]}
                max={income}
                step={10}
                onValueChange={(val) => handleSliderChange(category, val)}
                className="flex-grow"
              />
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(category, Number(e.target.value))}
                className="w-24 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-right"
                min="0"
                max={income}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <p className="font-semibold">Total Allocated: ${totalAllocated.toFixed(2)}</p>
        <p className={remaining >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
          Remaining: ${remaining.toFixed(2)}
        </p>
      </div>
    </InteractiveSimulation>
  );
};

export default BudgetSimulator;