import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface ResetButtonProps {
  onClick: () => void;
  text?: string;
}

function ResetButton({ onClick, text = 'Limpar Seleções' }: ResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none active:outline-none"
    >
      <ArrowPathIcon className="w-5 h-5" />
      {text}
    </button>
  );
}

export default ResetButton;

