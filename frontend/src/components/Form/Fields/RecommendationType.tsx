import React from 'react';
import Radio from '@components/shared/Radio';
import { RECOMMENDATION_TYPES, RECOMMENDATION_TYPE_LABELS } from '@constants/recommendationTypes';
import type { RecommendationType as RecommendationTypeValue } from '@constants/recommendationTypes';

interface RecommendationTypeProps {
  selectedType?: string;
  onRecommendationTypeChange: (type: RecommendationTypeValue) => void;
}

/**
 * Componente para seleção do tipo de recomendação
 * Permite ao usuário escolher entre recomendação única ou múltiplos produtos
 */
function RecommendationType({ selectedType = '', onRecommendationTypeChange }: RecommendationTypeProps) {
  const handleChange = (type: RecommendationTypeValue) => {
    onRecommendationTypeChange(type);
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2">Tipo de Recomendação:</h2>
      <div className="flex flex-col space-y-2">
        <Radio
          id="recommendation-type-single"
          name="recommendationType"
          value={RECOMMENDATION_TYPES.SINGLE_PRODUCT}
          checked={selectedType === RECOMMENDATION_TYPES.SINGLE_PRODUCT}
          onChange={() => handleChange(RECOMMENDATION_TYPES.SINGLE_PRODUCT)}
        >
          {RECOMMENDATION_TYPE_LABELS[RECOMMENDATION_TYPES.SINGLE_PRODUCT]}
        </Radio>
        <Radio
          id="recommendation-type-multiple"
          name="recommendationType"
          value={RECOMMENDATION_TYPES.MULTIPLE_PRODUCTS}
          checked={selectedType === RECOMMENDATION_TYPES.MULTIPLE_PRODUCTS}
          onChange={() => handleChange(RECOMMENDATION_TYPES.MULTIPLE_PRODUCTS)}
        >
          {RECOMMENDATION_TYPE_LABELS[RECOMMENDATION_TYPES.MULTIPLE_PRODUCTS]}
        </Radio>
      </div>
    </div>
  );
}

export default RecommendationType;

