import React from 'react';

interface GridDigitProps {
  value: string | number | null;
  border?: boolean;
  borderBottom?: boolean;
  className?: string;
  isSymbol?: boolean;
}

export const GridDigit: React.FC<GridDigitProps> = ({ 
  value, 
  border = true, 
  borderBottom = false,
  className = "",
  isSymbol = false
}) => {
  return (
    <div 
      className={`
        flex items-center justify-center 
        h-10 w-10 
        text-xl font-mono
        ${border ? 'border border-gray-300/50' : ''} 
        ${borderBottom ? 'border-b-2 border-b-gray-800' : ''}
        ${isSymbol ? 'text-gray-500 font-bold' : 'text-gray-800'}
        ${className}
      `}
    >
      {value}
    </div>
  );
};