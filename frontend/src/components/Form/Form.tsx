import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Preferences, Features, RecommendationType } from './Fields';
import { SubmitButton } from './SubmitButton';
import useProducts from '@hooks/useProducts';
import useForm from '@hooks/useForm';
import useRecommendations from '@hooks/useRecommendations';
import type { Recommendation, FormData } from '@appTypes';
import type { RecommendationType as RecommendationTypeValue } from '@constants/recommendationTypes';

interface FormProps {
  onRecommendationsChange: (recommendations: Recommendation[], formData: FormData) => void;
}

/**
 * Componente de formulário para coleta de preferências e features do usuário
 */
function Form({ onRecommendationsChange }: FormProps) {
  const { preferences, features, products } = useProducts();
  const { formData, handleChange } = useForm({
    selectedPreferences: [],
    selectedFeatures: [],
    selectedRecommendationType: '',
  });

  const { getRecommendations } = useRecommendations(products);
  const [validationError, setValidationError] = useState<string>('');

  /**
   * Handler para submissão do formulário
   * Obtém as recomendações baseadas nos dados do formulário e as passa para o componente pai
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setValidationError('');

    // Valida se há tipo de recomendação selecionado
    if (!formData.selectedRecommendationType) {
      const errorMsg = 'Por favor, selecione um tipo de recomendação.';
      setValidationError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Valida se há pelo menos uma preferência ou feature selecionada
    if (
      formData.selectedPreferences.length === 0 &&
      formData.selectedFeatures.length === 0
    ) {
      const errorMsg = 'Por favor, selecione pelo menos uma preferência ou funcionalidade.';
      setValidationError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Obtém as recomendações baseadas nos dados do formulário
    const recommendations = getRecommendations(formData);

    // Passa as recomendações e formData para o componente pai via callback
    if (onRecommendationsChange) {
      onRecommendationsChange(recommendations, formData);

      // Toast de sucesso
      if (recommendations.length > 0) {
        toast.success(
          `${recommendations.length} produto${recommendations.length > 1 ? 's' : ''} encontrado${recommendations.length > 1 ? 's' : ''}!`,
          {
            icon: '✅',
            duration: 3000,
          }
        );
      } else {
        toast.error('Nenhum produto encontrado com os critérios selecionados.', {
          duration: 3000,
        });
      }
    }
  };

  return (
    <form
      className="w-full bg-white rounded-xl shadow-lg p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <Preferences
        preferences={preferences}
        onPreferenceChange={(selected) =>
          handleChange('selectedPreferences', selected)
        }
      />
      <div className="border-t border-gray-300 my-6"></div>
      <Features
        features={features}
        onFeatureChange={(selected) =>
          handleChange('selectedFeatures', selected)
        }
      />
      <div className="border-t border-gray-300 my-6"></div>
      <RecommendationType
        selectedType={formData.selectedRecommendationType}
        onRecommendationTypeChange={(selected: RecommendationTypeValue) => {
          handleChange('selectedRecommendationType', selected);
          // Limpa erro de validação quando tipo é selecionado
          if (validationError && selected) {
            setValidationError('');
          }
        }}
      />
      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {validationError}
        </div>
      )}
      <div className="mt-6">
        <SubmitButton text="Obter recomendação" />
      </div>
    </form>
  );
}

export default Form;
