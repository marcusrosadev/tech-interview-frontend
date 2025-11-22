import React from 'react';

interface SubmitButtonProps {
  text: string;
}

function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="w-full bg-rd-dark hover:bg-rd-darker text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none active:outline-none"
    >
      {text}
    </button>
  );
}

export default SubmitButton;

