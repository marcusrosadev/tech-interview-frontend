import React, { useState } from 'react';
import { useToast } from '@hooks/useToast';
import { FormStepper } from './FormStepper';
import { ResetButton } from './ResetButton';
import useProducts from '@hooks/useProducts';
import useForm from '@hooks/useForm';
import useRecommendations from '@hooks/useRecommendations';
import type { Recommendation, FormData } from '@appTypes';

interface FormProps {
  onRecommendationsChange: (recommendations: Recommendation[], formData: FormData) => void;
  onReset?: () => void;
}

function Form({ onRecommendationsChange, onReset }: FormProps) {
  const { preferences, features, products } = useProducts();
  const { formData, handleChange, reset } = useForm({
    selectedPreferences: [],
    selectedFeatures: [],
    selectedRecommendationType: '',
  });

  const { getRecommendations } = useRecommendations(products);
  const [validationError, setValidationError] = useState<string>('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setValidationError('');

    if (!formData.selectedRecommendationType) {
      const errorMsg = 'Por favor, selecione um tipo de recomendação.';
      setValidationError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    if (
      formData.selectedPreferences.length === 0 &&
      formData.selectedFeatures.length === 0
    ) {
      const errorMsg = 'Por favor, selecione pelo menos uma preferência ou funcionalidade.';
      setValidationError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    const recommendations = getRecommendations(formData);

    if (onRecommendationsChange) {
      onRecommendationsChange(recommendations, formData);

      if (recommendations.length > 0) {
        showToast(
          `${recommendations.length} produto${recommendations.length > 1 ? 's' : ''} encontrado${recommendations.length > 1 ? 's' : ''}!`,
          'success',
          3000
        );
      } else {
        showToast('Nenhum produto encontrado com os critérios selecionados.', 'error', 3000);
      }
    }
  };

  const handleReset = (): void => {
    reset();
    setValidationError('');
    if (onReset) {
      onReset();
    }
    showToast('Seleções limpas com sucesso.', 'success', 2000);
  };

  return (
    <>
      <form
        id="recommendation-form"
        className="w-full bg-white rounded-xl shadow-lg p-6 mb-20"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormStepper
          preferences={preferences}
          features={features}
          formData={formData}
          onFormDataChange={(field, value) => {
            handleChange(field, value);
            if (field === 'selectedRecommendationType' && value && validationError) {
              setValidationError('');
            }
          }}
          validationError={validationError}
        />
      </form>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-2xl z-50 border-t border-gray-200">
        <div className="flex justify-end space-x-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResetButton onClick={handleReset} />
          <button
            type="submit"
            form="recommendation-form"
            className="inline-flex items-center bg-rd-dark hover:bg-rd-darker text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none active:outline-none"
          >
            Obter recomendação
          </button>
        </div>
      </div>
    </>
  );
}

export default Form;
