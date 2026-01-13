import React from 'react';
import { MathProblem, Operation } from '../types';
import { GridDigit } from './GridDigit';

interface Props {
  problem: MathProblem;
}

export const ProblemRenderer: React.FC<Props> = ({ problem }) => {
  const { type, top, bottom } = problem;

  // Convert numbers to array of digits for grid placement
  const topStr = top.toString().split('');
  const bottomStr = bottom.toString().split('');
  
  // Align right logic for vertical math
  const maxLen = Math.max(topStr.length, bottomStr.length);
  // Extra column for symbol
  const gridWidth = maxLen + 1; 

  // Pad arrays with nulls to match width (align right)
  const paddedTop = Array(maxLen - topStr.length).fill(null).concat(topStr);
  const paddedBottom = Array(maxLen - bottomStr.length).fill(null).concat(bottomStr);

  if (type === Operation.DIVISION) {
    // Standard Long Division Layout
    // Format: Divisor ) Dividend
    const dividendStr = top.toString().split('');
    const divisorStr = bottom.toString().split('');
    
    // We need space above for quotient
    // We need the divisor, then the bracket, then the dividend
    
    return (
      <div className="flex flex-col items-center justify-center p-2 w-full h-full">
        <div className="inline-block">
          {/* Quotient Row (Grid for students to write in) */}
          <div className="flex">
              {/* Spacer for divisor and bracket */}
              <div className="flex" style={{ width: `${divisorStr.length * 2.5 + 2.5}rem` }}></div> 
              {/* Grid for Dividend digits (Quotient goes here) */}
              {dividendStr.map((_, i) => (
                 <GridDigit key={`q-${i}`} value="" border />
              ))}
          </div>

          {/* Problem Row */}
          <div className="flex items-stretch">
              {/* Divisor */}
              <div className="flex">
                  {divisorStr.map((d, i) => (
                      <GridDigit key={`d-${i}`} value={d} border={false} className="border-none font-bold !w-10 text-right pr-1" />
                  ))}
              </div>

              {/* Bracket */}
              <div className="w-4 border-r-2 border-gray-800 rounded-tr-lg mr-1 relative -top-1"></div>

              {/* Dividend */}
              <div className="flex border-t-2 border-gray-800 -ml-1">
                   {dividendStr.map((d, i) => (
                      <GridDigit key={`div-${i}`} value={d} border={true} className="!border-gray-300/50" />
                  ))}
              </div>
          </div>

          {/* Workspace Grid Below (Optional, just some empty rows for work) */}
          <div className="mt-0 ml-auto" style={{ paddingLeft: `${divisorStr.length * 2.5 + 1.5}rem` }}>
               {Array.from({ length: 5 }).map((_, rowI) => (
                  <div key={rowI} className="flex">
                      {dividendStr.map((_, colI) => (
                           <GridDigit key={`work-${rowI}-${colI}`} value="" border />
                      ))}
                  </div>
               ))}
          </div>
        </div>
      </div>
    );
  }

  // Vertical Stack (Add, Sub, Mult)
  const symbol = type === Operation.ADDITION ? '+' : type === Operation.SUBTRACTION ? '−' : '×';

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full h-full">
      <div className="inline-block">
        {/* Top Number */}
        <div className="flex justify-end">
          {/* Spacer for symbol column */}
          <GridDigit value="" border={false} />
          {paddedTop.map((d, i) => (
            <GridDigit key={`t-${i}`} value={d || ""} border />
          ))}
        </div>

        {/* Bottom Number with Symbol */}
        <div className="flex justify-end relative">
          <GridDigit value={symbol} border={false} isSymbol className="absolute left-0 bottom-1" />
          <GridDigit value="" border={false} /> 
          {paddedBottom.map((d, i) => (
            <GridDigit 
              key={`b-${i}`} 
              value={d || ""} 
              border 
              borderBottom 
              className={d ? "border-b-gray-800" : ""}
            />
          ))}
        </div>

        {/* Answer Rows (Grid for students to write in) */}
        <div className="flex justify-end">
           <GridDigit value="" border={false} />
           {Array(maxLen).fill(null).map((_, i) => (
              <GridDigit key={`a-${i}`} value="" border />
           ))}
        </div>
         {/* Extra grid row for carry/borrow or multi-step mult */}
         {type === Operation.MULTIPLICATION && bottomStr.length > 1 && (
           <>
            {Array(bottomStr.length).fill(null).map((_, row) => (
               <div key={`m-row-${row}`} className="flex justify-end">
                  <GridDigit value="0" border={false} className="text-gray-200" />
                  {Array(maxLen + row + 1).fill(null).map((__, col) => (
                    <GridDigit key={`m-cell-${row}-${col}`} value="" border />
                  ))}
               </div>
            ))}
           </>
         )}
      </div>
    </div>
  );
};