import React from 'react';

interface RadioProps {
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}

function Radio({ value, checked, onChange, name, id, children, className = '' }: RadioProps) {
  return (
    <label htmlFor={id} className={`flex items-center cursor-pointer outline-none ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio h-5 w-5 text-rd-cyan focus:outline-none focus:ring-0"
      />
      <span className="ml-2">{children}</span>
    </label>
  );
}

export default Radio;

