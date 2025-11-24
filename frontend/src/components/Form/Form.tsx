import React, { useState, useEffect } from 'react';
import { useToast } from '@hooks/useToast';
import { FormStepper, TOTAL_STEPS } from './FormStepper';
import { ResetButton } from './ResetButton';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const { showToast } = useToast();

  useEffect(() => {
    if (
      formData.selectedPreferences.length === 0 &&
      formData.selectedFeatures.length === 0 &&
      formData.selectedRecommendationType === ''
    ) {
      setCurrentStep(1);
      setDirection('right');
    }
  }, [formData.selectedPreferences, formData.selectedFeatures, formData.selectedRecommendationType]);

  const goToNextStep = (): void => {
    if (currentStep < TOTAL_STEPS) {
      setDirection('right');
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = (): void => {
    if (currentStep > 1) {
      setDirection('left');
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number): void => {
    if (step > currentStep) {
      setDirection('right');
    } else if (step < currentStep) {
      setDirection('left');
    }
    setCurrentStep(step);
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return !!formData.selectedRecommendationType;
      default:
        return false;
    }
  };

  const isLastStep = currentStep === TOTAL_STEPS;

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
    setCurrentStep(1);
    setDirection('right');
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
          currentStep={currentStep}
          direction={direction}
          onFormDataChange={(field: keyof FormData, value: string | string[]) => {
            handleChange(field, value);
            if (field === 'selectedRecommendationType' && value && validationError) {
              setValidationError('');
            }
          }}
          validationError={validationError}
        />
      </form>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Botões empilhados */}
          <div className="flex flex-col gap-3 py-4 md:hidden">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeftIcon className="w-5 h-5" />
                Voltar
              </button>
              {isLastStep ? (
                <button
                  type="submit"
                  form="recommendation-form"
                  disabled={!formData.selectedRecommendationType}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                    formData.selectedRecommendationType
                      ? 'bg-rd-dark hover:bg-rd-darker text-white hover:scale-105 hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } focus:outline-none active:outline-none`}
                >
                  Obter recomendação
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!canGoNext()}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                    canGoNext()
                      ? 'bg-rd-cyan-light text-rd-dark'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } focus:outline-none active:outline-none`}
                >
                  Avançar
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <ResetButton onClick={handleReset} />
          </div>

          {/* Desktop/Tablet: Botões lado a lado */}
          <div className="hidden md:flex items-center justify-between py-4">
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
              Voltar
            </button>

            <div className="flex items-center gap-4">
              <ResetButton onClick={handleReset} />
              {isLastStep ? (
                <button
                  type="submit"
                  form="recommendation-form"
                  disabled={!formData.selectedRecommendationType}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                    formData.selectedRecommendationType
                      ? 'bg-rd-dark hover:bg-rd-darker text-white hover:scale-105 hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } focus:outline-none active:outline-none`}
                >
                  Obter recomendação
                </button>
              ) : (
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!canGoNext()}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  canGoNext()
                    ? 'bg-rd-cyan-light text-rd-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } focus:outline-none active:outline-none`}
              >
                Avançar
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form;
