import React, { useState, useEffect, useRef } from 'react';
import { Operation, WorksheetConfig, MathProblem } from './types';
import { generateProblems } from './services/mathUtils';
import { Controls } from './components/Controls';
import { ProblemRenderer } from './components/ProblemRenderer';

// Helper to chunk array
const chunk = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const App: React.FC = () => {
  const [config, setConfig] = useState<WorksheetConfig>({
    operation: Operation.ADDITION,
    count: 12,
    topDigits: 2,
    useCustomTopRange: false,
    
    bottomDigits: 2,
    useFactFamilies: false,
    selectedNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    
    allowRemainders: false,
    gridSize: 'md',
    seed: Date.now()
  });

  const [problems, setProblems] = useState<MathProblem[]>([]);
  
  useEffect(() => {
    // Generate new problems whenever config changes
    const newProblems = generateProblems(config);
    setProblems(newProblems);
  }, [
    config.operation, 
    config.count, 
    config.topDigits, 
    config.useCustomTopRange,
    config.topMin,
    config.topMax,
    config.bottomDigits, 
    config.useFactFamilies,
    config.selectedNumbers,
    config.allowRemainders, 
    config.seed
  ]);

  // Dynamic Layout Calculation based on problem density
  const getLayoutSettings = () => {
    const { operation, topDigits, bottomDigits } = config;

    // Division is the space hog
    if (operation === Operation.DIVISION) {
      // Very large division
      if (topDigits >= 4) {
        return { cols: 2, rows: 3, perPage: 6 };
      }
      // Standard division
      return { cols: 2, rows: 4, perPage: 8 };
    }

    // Multiplication with multiple digits on bottom requires many rows for work
    if (operation === Operation.MULTIPLICATION && bottomDigits >= 2) {
      if (bottomDigits >= 3) {
         return { cols: 2, rows: 4, perPage: 8 }; // Huge multiplication
      }
      return { cols: 3, rows: 3, perPage: 9 }; // Standard multi-digit
    }

    // Standard Addition/Subtraction/Single-digit Mult
    // We can fit more
    return { cols: 4, rows: 4, perPage: 16 };
  };

  const layout = getLayoutSettings();
  const pages = chunk(problems, layout.perPage);

  const handleRegenerate = () => {
    setConfig(prev => ({ ...prev, seed: Date.now() }));
  };

  const handlePrint = () => {
    // We grab all elements with class 'worksheet-page' and print them
    // But since they are already in the DOM, we can just print the window content
    // However, the Controls are hidden via CSS media print.
    // The main issue is ensuring the 'worksheet-page' divs break correctly.
    
    // We'll use the iframe technique to ensure clean context
    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (!printWindow) {
      alert('Please allow popups to print the worksheet.');
      return;
    }

    // Collect all page HTMLs
    const pagesContainer = document.getElementById('pages-root');
    if (!pagesContainer) return;

    const styles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Nunito:wght@400;600;700&display=swap');
        
        * { box-sizing: border-box; }

        body {
          font-family: 'Nunito', sans-serif;
          margin: 0;
          padding: 0;
          background-color: white;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        /* The Sheet */
        .worksheet-page {
          width: 8.5in;
          height: 11in;
          margin: 0;
          padding: 0.5in;
          page-break-after: always;
          break-after: page;
          position: relative;
          overflow: hidden; /* Safety against spillover */
        }
        
        .worksheet-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }

        /* Grid Layouts */
        .grid-layout {
          display: grid;
          width: 100%;
          height: 100%;
          /* Grid gap handled in component inline styles or classes */
        }

        @media print {
          @page {
            margin: 0; /* We handle margins inside the .worksheet-page div */
            size: letter;
          }
          body {
            background: white;
          }
        }
      </style>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MathGrid Worksheet - ${config.operation}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          ${styles}
        </head>
        <body>
          ${pagesContainer.innerHTML}
          <script>
            setTimeout(() => {
              window.print();
            }, 800);
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Controls */}
      <Controls 
        config={config} 
        setConfig={setConfig} 
        onGenerate={handleRegenerate} 
        onPrint={handlePrint}
      />

      {/* Main Preview Area */}
      <div className="flex-1 ml-0 md:ml-96 p-8 flex flex-col items-center gap-8 min-h-screen overflow-y-auto">
        
        <div id="pages-root" className="flex flex-col gap-8">
          {pages.map((pageProblems, pageIndex) => (
            <div 
              key={`page-${pageIndex}`} 
              className="worksheet-page bg-white shadow-2xl w-[8.5in] h-[11in] flex flex-col relative"
              style={{ padding: '0.5in' }}
            >
              {/* Header */}
              <div className="pb-6 border-b-2 border-gray-100 mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1 font-mono uppercase tracking-widest">{config.operation}</h1>
                  {pages.length > 1 && <span className="text-xs text-gray-400 font-bold uppercase">Page {pageIndex + 1} of {pages.length}</span>}
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <span className="font-bold text-gray-400 mr-2">NAME:</span>
                    <span className="inline-block w-48 border-b-2 border-gray-300"></span>
                  </div>
                  <div className="text-sm text-gray-400">Score: ______ / {pageProblems.length}</div>
                </div>
              </div>

              {/* Grid Content */}
              <div 
                className="grid-layout grid flex-1"
                style={{ 
                  gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                  gap: '2rem'
                }}
              >
                {pageProblems.map((problem, idx) => (
                  <div key={problem.id} className="relative w-full h-full border-gray-100">
                    <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold z-10 print:bg-white print:text-black print:border print:border-black">
                      {(pageIndex * layout.perPage) + idx + 1}
                    </div>
                    <ProblemRenderer problem={problem} />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-4 w-full text-center text-[10px] text-gray-300">
                 MathGrid Worksheet • {config.seed}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-gray-400 text-sm font-medium pb-8 no-print">
          Showing {pages.length} page{pages.length !== 1 ? 's' : ''} based on problem size.
        </div>

      </div>
    </div>
  );
};

export default App;