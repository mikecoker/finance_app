import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">FinanceEdu</h3>
            <p className="text-gray-300 text-sm">
              Interactive personal finance education with character-guided learning and engaging lessons.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/course" className="text-gray-300 hover:text-white text-sm">
                  Course
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-gray-300 hover:text-white text-sm">
                  Demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm mb-2">
              Have questions about the course?
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
              Contact Us
            </button>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} FinanceEdu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
