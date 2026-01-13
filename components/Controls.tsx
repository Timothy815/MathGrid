import React, { useState } from 'react';
import { Operation, WorksheetConfig } from '../types';

interface Props {
  config: WorksheetConfig;
  setConfig: React.Dispatch<React.SetStateAction<WorksheetConfig>>;
  onGenerate: () => void;
  onPrint: () => void;
}

export const Controls: React.FC<Props> = ({ 
  config, 
  setConfig, 
  onGenerate, 
  onPrint
}) => {
  const [customNumberInput, setCustomNumberInput] = useState("");

  const handleChange = (field: keyof WorksheetConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const toggleNumberSelection = (num: number) => {
    const current = config.selectedNumbers;
    const isSelected = current.includes(num);
    let newSelection;
    if (isSelected) {
      newSelection = current.filter(n => n !== num);
    } else {
      newSelection = [...current, num].sort((a, b) => a - b);
    }
    handleChange('selectedNumbers', newSelection);
  };

  const addCustomNumber = () => {
    const num = parseInt(customNumberInput);
    if (!isNaN(num)) {
      if (!config.selectedNumbers.includes(num)) {
        const newSelection = [...config.selectedNumbers, num].sort((a, b) => a - b);
        handleChange('selectedNumbers', newSelection);
      }
      setCustomNumberInput("");
    }
  };

  // Helper to determine labels based on operation
  const topLabel = config.operation === Operation.DIVISION ? 'Dividend' : 'Top Number';
  const bottomLabel = config.operation === Operation.DIVISION ? 'Divisor' : 'Bottom Number';

  return (
    <div className="w-full md:w-96 bg-white shadow-xl p-6 h-screen overflow-y-auto fixed left-0 top-0 z-10 no-print flex flex-col border-r border-gray-100">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 3.659c0 3.074-1.8 5.682-4.5 6.909a6.002 6.002 0 01-3 0c-2.7-1.227-4.5-3.835-4.5-6.909V7h6m0-3.659C12.339 3 15 5.659 15 9.341m-6-6.341C6.661 3 4 5.659 4 9.341" />
        </svg>
        MathGrid
      </h1>

      <div className="space-y-8 flex-1">
        {/* Operation Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Operation</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(Operation).map((op) => (
              <button
                key={op}
                onClick={() => handleChange('operation', op)}
                className={`px-3 py-2 text-sm rounded-md transition-all font-medium ${
                  config.operation === op
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* Top Number Configuration */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">{topLabel}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Number of Digits
                </label>
                <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={config.topDigits}
                      onChange={(e) => handleChange('topDigits', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm font-bold text-indigo-600 w-8">{config.topDigits}</div>
                </div>
              </div>

              {/* Range Bracketing */}
              <div>
                 <div className="flex items-center mb-2">
                    <input 
                      type="checkbox" 
                      id="customRange"
                      checked={config.useCustomTopRange}
                      onChange={(e) => handleChange('useCustomTopRange', e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-white border-gray-300"
                    />
                    <label htmlFor="customRange" className="ml-2 text-xs font-semibold text-gray-600 cursor-pointer">
                       Limit Range (Bracketing)
                    </label>
                 </div>
                 
                 {config.useCustomTopRange && (
                   <div className="grid grid-cols-2 gap-2 animate-fadeIn">
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 font-bold">Min</label>
                        <input 
                          type="number" 
                          value={config.topMin ?? Math.pow(10, config.topDigits-1)}
                          onChange={(e) => handleChange('topMin', parseInt(e.target.value))}
                          className="w-full text-sm bg-white text-gray-900 border border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 font-bold">Max</label>
                        <input 
                          type="number" 
                          value={config.topMax ?? Math.pow(10, config.topDigits)-1}
                          onChange={(e) => handleChange('topMax', parseInt(e.target.value))}
                          className="w-full text-sm bg-white text-gray-900 border border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
                        />
                      </div>
                   </div>
                 )}
              </div>
            </div>
        </div>

        {/* Bottom Number Configuration */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
               <h3 className="text-sm font-bold text-gray-900">{bottomLabel}</h3>
               {/* Toggle for Fact Families */}
               <div className="flex bg-gray-200 rounded p-0.5">
                  <button 
                    onClick={() => handleChange('useFactFamilies', false)}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${!config.useFactFamilies ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                  >
                    Digits
                  </button>
                  <button 
                    onClick={() => handleChange('useFactFamilies', true)}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${config.useFactFamilies ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                  >
                    Facts
                  </button>
               </div>
            </div>
            
            {!config.useFactFamilies ? (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Number of Digits
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={config.bottomDigits}
                    onChange={(e) => handleChange('bottomDigits', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm font-bold text-indigo-600 w-8">{config.bottomDigits}</div>
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                 <label className="block text-xs font-medium text-gray-500 mb-2">
                   Select Numbers
                 </label>
                 
                 {/* Standard Fact Family Grid */}
                 <div className="grid grid-cols-4 gap-2 mb-3">
                   {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                     <button
                       key={num}
                       onClick={() => toggleNumberSelection(num)}
                       className={`
                         h-8 text-sm font-bold rounded border transition-colors
                         ${config.selectedNumbers.includes(num)
                           ? 'bg-indigo-600 border-indigo-600 text-white'
                           : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                         }
                       `}
                     >
                       {num}
                     </button>
                   ))}
                 </div>

                 {/* Custom Number Input */}
                 <div className="flex gap-2 mb-3">
                    <input 
                      type="number"
                      placeholder="Custom #"
                      value={customNumberInput}
                      onChange={(e) => setCustomNumberInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomNumber()}
                      className="flex-1 min-w-0 text-sm bg-white text-gray-900 border border-gray-300 rounded p-1.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <button 
                      onClick={addCustomNumber}
                      className="bg-gray-800 text-white text-xs font-bold px-3 rounded hover:bg-gray-700"
                    >
                      ADD
                    </button>
                 </div>

                 {/* Selected Custom Numbers (Above 12) */}
                 <div className="flex flex-wrap gap-1.5">
                    {config.selectedNumbers.filter(n => n > 12).map(num => (
                       <span key={num} onClick={() => toggleNumberSelection(num)} className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-medium cursor-pointer hover:bg-indigo-200 border border-indigo-200">
                          {num} 
                          <span className="ml-1 text-indigo-400 font-bold">×</span>
                       </span>
                    ))}
                 </div>

                 <div className="mt-2 flex justify-between pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleChange('selectedNumbers', [])}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      Clear All
                    </button>
                    <button 
                      onClick={() => handleChange('selectedNumbers', [0,1,2,3,4,5,6,7,8,9,10,11,12])}
                      className="text-xs text-indigo-500 hover:text-indigo-700"
                    >
                      Reset Standard
                    </button>
                 </div>
                 {config.selectedNumbers.length === 0 && (
                   <p className="text-[10px] text-red-500 mt-1">Please select at least one number.</p>
                 )}
              </div>
            )}

            {config.operation === Operation.DIVISION && (
                <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
                  <input
                    id="remainders"
                    type="checkbox"
                    checked={config.allowRemainders}
                    onChange={(e) => handleChange('allowRemainders', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white"
                  />
                  <label htmlFor="remainders" className="ml-2 block text-sm text-gray-900">
                    Allow Remainders
                  </label>
                </div>
              )}
        </div>

        {/* Worksheet Settings */}
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Worksheet Size</label>
           <select 
             value={config.count}
             onChange={(e) => handleChange('count', parseInt(e.target.value))}
             className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white text-gray-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
           >
             <option value={10}>10 Problems</option>
             <option value={12}>12 Problems</option>
             <option value={15}>15 Problems</option>
             <option value={20}>20 Problems</option>
             <option value={24}>24 Problems</option>
             <option value={30}>30 Problems</option>
             <option value={40}>40 Problems</option>
             <option value={48}>48 Problems</option>
             <option value={60}>60 Problems</option>
           </select>
           <p className="text-xs text-gray-400 mt-1">
             (Will paginate automatically if needed)
           </p>
        </div>

        <button
          onClick={onGenerate}
          className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 px-4 rounded-md font-bold hover:bg-indigo-50 transition-colors shadow-sm"
        >
          Regenerate Numbers
        </button>
      </div>

      <div className="pt-6 mt-auto">
        <button
          onClick={onPrint}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Worksheet
        </button>
      </div>
    </div>
  );
};