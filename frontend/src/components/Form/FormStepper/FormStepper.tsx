import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Preferences, Features, RecommendationType } from '../Fields';
import type { FormData } from '@appTypes';
import type { RecommendationType as RecommendationTypeValue } from '@constants/recommendationTypes';

interface FormStepperProps {
  preferences: string[];
  features: string[];
  formData: FormData;
  onFormDataChange: (field: keyof FormData, value: string | string[]) => void;
  validationError?: string;
}

const TOTAL_STEPS = 3;

/**
 * Componente Stepper para navegação horizontal entre etapas do formulário
 */
function FormStepper({
  preferences,
  features,
  formData,
  onFormDataChange,
  validationError,
}: FormStepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Reset para etapa 1 quando o formulário for limpo
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
        // Pode avançar mesmo sem selecionar preferências
        return true;
      case 2:
        // Pode avançar mesmo sem selecionar funcionalidades
        return true;
      case 3:
        // Precisa selecionar tipo de recomendação
        return !!formData.selectedRecommendationType;
      default:
        return false;
    }
  };

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 1:
        return 'Preferências';
      case 2:
        return 'Funcionalidades';
      case 3:
        return 'Tipo de Recomendação';
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      {/* Barra de Progresso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Etapa {currentStep} de {TOTAL_STEPS}
          </span>
          <span className="text-sm font-semibold text-rd-dark">{getStepTitle()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Container do conteúdo com overflow hidden para esconder etapas adjacentes */}
      <div className="relative overflow-hidden min-h-[350px] max-h-[500px]">
        <AnimatePresence mode="wait">
          {/* Etapa 1: Preferências */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'right' ? -100 : 100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 overflow-y-auto pr-2"
            >
              <Preferences
                preferences={preferences}
                selectedPreferences={formData.selectedPreferences}
                onPreferenceChange={(selected) => onFormDataChange('selectedPreferences', selected)}
              />
            </motion.div>
          )}

          {/* Etapa 2: Funcionalidades */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'right' ? -100 : 100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 overflow-y-auto pr-2"
            >
              <Features
                features={features}
                selectedFeatures={formData.selectedFeatures}
                onFeatureChange={(selected) => onFormDataChange('selectedFeatures', selected)}
              />
            </motion.div>
          )}

          {/* Etapa 3: Tipo de Recomendação */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'right' ? -100 : 100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <RecommendationType
                selectedType={formData.selectedRecommendationType}
                onRecommendationTypeChange={(selected: RecommendationTypeValue) => {
                  onFormDataChange('selectedRecommendationType', selected);
                }}
              />
              {validationError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {validationError}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navegação entre etapas */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
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

        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => goToStep(step)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                step === currentStep
                  ? 'bg-indigo-600 w-8'
                  : step < currentStep
                    ? 'bg-indigo-300'
                    : 'bg-gray-300'
              }`}
              aria-label={`Ir para etapa ${step}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goToNextStep}
          disabled={currentStep === TOTAL_STEPS || !canGoNext()}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentStep === TOTAL_STEPS || !canGoNext()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          Avançar
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default FormStepper;

