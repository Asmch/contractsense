"use client";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
