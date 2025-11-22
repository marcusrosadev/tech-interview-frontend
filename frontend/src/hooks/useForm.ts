import { useState } from 'react';
import type { FormData } from '@appTypes';

/**
 * Hook customizado para gerenciar estado de formulário
 * Fornece uma interface simples para atualizar campos do formulário
 */
const useForm = (initialState: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialState);

  /**
   * Atualiza um campo específico do formulário
   */
  const handleChange = (field: keyof FormData, value: string | string[]): void => {
    setFormData((prevData: FormData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return { formData, handleChange };
};

export default useForm;

