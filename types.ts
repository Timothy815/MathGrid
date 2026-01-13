export enum Operation {
  ADDITION = 'Addition',
  SUBTRACTION = 'Subtraction',
  MULTIPLICATION = 'Multiplication',
  DIVISION = 'Division'
}

export interface MathProblem {
  id: string;
  type: Operation;
  top: number;
  bottom: number;
  // For division: top is dividend, bottom is divisor
}

export interface WorksheetConfig {
  operation: Operation;
  count: number;
  
  // Top Number Configuration
  topDigits: number; // or Dividend length
  useCustomTopRange: boolean;
  topMin?: number;
  topMax?: number;

  // Bottom Number Configuration
  bottomDigits: number; // or Divisor length
  useFactFamilies: boolean; // If true, use selectedNumbers instead of bottomDigits
  selectedNumbers: number[]; // For fact families (e.g. [0, 1, 2... 12])
  
  allowRemainders: boolean; // Specific to division
  gridSize: 'sm' | 'md' | 'lg';
  seed: number;
}