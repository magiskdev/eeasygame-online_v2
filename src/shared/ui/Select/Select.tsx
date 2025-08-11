"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id?: string;
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Выберите...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-2 text-white/90"
        >
          {label}
        </label>
      )}
      
      <div
        className={`
          relative w-full px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200
          ${isOpen 
            ? 'bg-white/10 border-blue-500 ring-2 ring-blue-500/20' 
            : 'bg-white/5 border-white/20 hover:border-white/40'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <span className={`
            ${selectedOption ? 'text-white' : 'text-white/50'}
          `}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <motion.svg
            className="w-5 h-5 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors duration-150
                    hover:bg-white/10
                    ${option.value === value ? 'bg-blue-500/20 text-blue-300' : 'text-white'}
                  `}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
