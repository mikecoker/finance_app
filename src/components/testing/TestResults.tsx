import React from 'react';
import { motion } from 'framer-motion';

interface TestResultsProps {
  results: {
    component: string;
    status: 'passed' | 'failed';
    notes?: string;
  }[];
}

export const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  const passedTests = results.filter(r => r.status === 'passed').length;
  const totalTests = results.length;
  const passPercentage = Math.round((passedTests / totalTests) * 100);
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Application Test Results</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Test Coverage</span>
          <span className={passPercentage === 100 ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
            {passedTests} / {totalTests} tests passed ({passPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${passPercentage === 100 ? 'bg-green-600' : 'bg-amber-500'}`}
            style={{ width: `${passPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Component
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.component}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    result.status === 'passed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {result.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestResults;
