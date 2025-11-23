import { useState } from 'react';
import type { FormData } from '@appTypes';

const useForm = (initialState: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialState);

  const handleChange = (field: keyof FormData, value: string | string[]): void => {
    setFormData((prevData: FormData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const reset = (): void => {
    setFormData(initialState);
  };

  return { formData, handleChange, reset };
};

export default useForm;

