import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Preferences, Features, RecommendationType } from '../Fields';
import type { FormData } from '@appTypes';
import type { RecommendationType as RecommendationTypeValue } from '@constants/recommendationTypes';

interface FormStepperProps {
  preferences: string[];
  features: string[];
  formData: FormData;
  currentStep: number;
  direction: 'left' | 'right';
  onFormDataChange: (field: keyof FormData, value: string | string[]) => void;
  validationError?: string;
}

export const TOTAL_STEPS = 3;

function FormStepper({
  preferences,
  features,
  formData,
  currentStep,
  direction,
  onFormDataChange,
  validationError,
}: FormStepperProps) {

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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Etapa {currentStep} de {TOTAL_STEPS}
          </span>
          <span className="text-sm font-semibold text-rd-dark">{getStepTitle()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-rd-cyan h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative overflow-hidden min-h-[350px] max-h-[500px]">
        <AnimatePresence mode="wait">
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
    </div>
  );
}

export { FormStepper };
export default FormStepper;

