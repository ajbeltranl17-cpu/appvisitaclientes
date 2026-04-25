import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-[#1A3651] text-white hover:bg-[#0d1c2d]",
    secondary: "bg-[#C5A059] text-white hover:bg-[#b08e48]",
    outline: "border-2 border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};
