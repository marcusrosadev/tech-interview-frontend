import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
}

function Checkbox({ children, checked, ...props }: CheckboxProps) {
  return (
    <label
      className={`
        flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 outline-none bg-white
        ${checked
          ? 'border-rd-cyan shadow-md'
          : 'border-gray-300 hover:border-rd-cyan hover:shadow-sm'
        }
      `}
      tabIndex={0}
    >
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-rd-cyan focus:outline-none focus:ring-0"
        checked={checked}
        {...props}
      />
      <span className="ml-3 text-sm font-medium text-gray-700 flex-1">{children}</span>
    </label>
  );
}

export default Checkbox;
