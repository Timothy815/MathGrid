import { MathProblem, Operation, WorksheetConfig } from '../types';

export const generateRandomNumber = (digits: number, minOverride?: number, maxOverride?: number): number => {
  let min = Math.pow(10, digits - 1);
  let max = Math.pow(10, digits) - 1;

  if (minOverride !== undefined) min = Math.max(min, minOverride);
  if (maxOverride !== undefined) max = Math.min(max, maxOverride);
  
  // Safety check to ensure min <= max
  if (min > max) {
    // If range is invalid, fallback to digit-based logic without overrides or swap
    min = Math.pow(10, digits - 1);
    max = Math.pow(10, digits) - 1;
    if (minOverride !== undefined && minOverride <= max) min = minOverride;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateProblems = (config: WorksheetConfig): MathProblem[] => {
  const problems: MathProblem[] = [];
  const { 
    useFactFamilies, 
    selectedNumbers, 
    useCustomTopRange, 
    topMin, 
    topMax,
    topDigits,
    bottomDigits
  } = config;

  for (let i = 0; i < config.count; i++) {
    const id = `prob-${config.seed}-${i}`;
    let top = 0;
    let bottom = 0;

    // Helper to get bottom number
    const getBottomNumber = () => {
      if (useFactFamilies && selectedNumbers.length > 0) {
        const idx = Math.floor(Math.random() * selectedNumbers.length);
        return selectedNumbers[idx];
      }
      return generateRandomNumber(bottomDigits);
    };

    // Helper to get top number (respecting range overrides)
    const getTopNumber = () => {
      return generateRandomNumber(
        topDigits, 
        useCustomTopRange ? topMin : undefined, 
        useCustomTopRange ? topMax : undefined
      );
    };

    switch (config.operation) {
      case Operation.ADDITION:
        top = getTopNumber();
        bottom = getBottomNumber();
        break;

      case Operation.SUBTRACTION:
        // For subtraction, usually Top - Bottom = Result.
        // We generate Top and Bottom.
        top = getTopNumber();
        bottom = getBottomNumber();
        // Ensure top is larger
        if (bottom > top) {
          const temp = top;
          top = bottom;
          bottom = temp;
        }
        break;

      case Operation.MULTIPLICATION:
        top = getTopNumber();
        bottom = getBottomNumber();
        break;

      case Operation.DIVISION:
        const divisor = getBottomNumber();
        
        if (config.allowRemainders) {
           top = getTopNumber(); 
           bottom = divisor;
        } else {
           // Ensure integer result: Dividend (Top) = Divisor (Bottom) * Quotient
           // We want Dividend to roughly match topDigits (or topMin/topMax range)
           
           // Target Range for Dividend
           let targetMin = useCustomTopRange && topMin ? topMin : Math.pow(10, topDigits - 1);
           let targetMax = useCustomTopRange && topMax ? topMax : Math.pow(10, topDigits) - 1;

           // We need a multiple of divisor within [targetMin, targetMax]
           // Smallest multiple >= targetMin
           let minQuotient = Math.ceil(targetMin / (divisor || 1));
           let maxQuotient = Math.floor(targetMax / (divisor || 1));
           
           // If no valid multiple exists in range (e.g. range 10-11, divisor 5. 10 is ok. range 10-12, divisor 7. 7*1=7, 7*2=14. No match.)
           // Expand range slightly if needed or just clamp
           if (minQuotient > maxQuotient) {
             // Fallback: Just generate a quotient based on digits approximation
             const qDigits = Math.max(1, topDigits - (divisor.toString().length));
             minQuotient = Math.pow(10, qDigits - 1);
             maxQuotient = Math.pow(10, qDigits) - 1;
           }

           const quotient = Math.floor(Math.random() * (maxQuotient - minQuotient + 1)) + minQuotient;
           
           top = divisor * quotient;
           bottom = divisor;
        }
        break;
    }

    problems.push({
      id,
      type: config.operation,
      top,
      bottom,
    });
  }

  return problems;
};