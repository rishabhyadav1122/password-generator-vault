'use client';

import { useState } from 'react';
import { generatePassword, defaultPasswordOptions } from '@/lib/passwordGenerator';
import { PasswordGeneratorOptions } from '@/types';
import { Copy, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordGeneratorOptions>(defaultPasswordOptions);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    try {
      const password = generatePassword(options);
      setGeneratedPassword(password);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const handleCopy = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy password:', error);
      }
    }
  };

  const updateOption = (key: keyof PasswordGeneratorOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Password Generator</h2>
      
      {/* Length Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Length: {options.length}
        </label>
        <input
          type="range"
          min="8"
          max="64"
          value={options.length}
          onChange={(e) => updateOption('length', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Character Options */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeUppercase}
            onChange={(e) => updateOption('includeUppercase', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Include Uppercase (A-Z)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeLowercase}
            onChange={(e) => updateOption('includeLowercase', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Include Lowercase (a-z)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeNumbers}
            onChange={(e) => updateOption('includeNumbers', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Include Numbers (0-9)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeSymbols}
            onChange={(e) => updateOption('includeSymbols', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Include Symbols (!@#$...)</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.excludeLookAlikes}
            onChange={(e) => updateOption('excludeLookAlikes', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Exclude Look-alikes (0O1lI)</span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Generate Password
      </button>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Generated Password:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                copied 
                  ? 'bg-green-600 dark:bg-green-500 text-white' 
                  : 'bg-gray-600 dark:bg-gray-500 text-white hover:bg-gray-700 dark:hover:bg-gray-600'
              }`}
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
