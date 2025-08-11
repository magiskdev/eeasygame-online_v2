"use client";

import React from "react";
import { motion } from "framer-motion";

export interface CheckboxProps {
  id?: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`
          relative w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200
          ${checked 
            ? 'bg-blue-500 border-blue-500' 
            : 'bg-white/5 border-white/20 hover:border-white/40'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
        onClick={handleChange}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
        
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </div>
      
      {label && (
        <label
          htmlFor={id}
          className={`
            text-sm font-medium cursor-pointer select-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-white/90'}
          `}
          onClick={handleChange}
        >
          {label}
        </label>
      )}
    </div>
  );
};
