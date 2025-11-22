import React, { useState, useEffect, useRef } from 'react';
import Checkbox from '@components/shared/Checkbox';

interface FeaturesProps {
  features: string[];
  selectedFeatures?: string[];
  onFeatureChange: (features: string[]) => void;
}

/**
 * Compara dois arrays de strings para verificar se são iguais
 */
const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

/**
 * Componente para seleção de features
 */
function Features({ features, selectedFeatures = [], onFeatureChange }: FeaturesProps) {
  const [currentFeatures, setCurrentFeatures] = useState<string[]>(selectedFeatures);
  const prevSelectedRef = useRef<string[]>(selectedFeatures);

  useEffect(() => {
    // Só atualiza se o array realmente mudou (comparação profunda)
    if (!arraysEqual(prevSelectedRef.current, selectedFeatures)) {
      setCurrentFeatures(selectedFeatures);
      prevSelectedRef.current = selectedFeatures;
    }
  }, [selectedFeatures]);

  /**
   * Handler para mudança de feature individual
   */
  const handleFeatureChange = (feature: string): void => {
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((feat) => feat !== feature)
      : [...currentFeatures, feature];

    setCurrentFeatures(updatedFeatures);
    onFeatureChange(updatedFeatures);
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Funcionalidades:</h2>
      <div className="space-y-2">
        {features.map((feature, index) => {
          // Usa uma combinação de feature + index para criar key única
          // Em produção, features deveriam ter IDs únicos
          const uniqueKey = `feature-${feature}-${index}`;
          return (
            <Checkbox
              key={uniqueKey}
              value={feature}
              checked={currentFeatures.includes(feature)}
              onChange={() => handleFeatureChange(feature)}
            >
              {feature}
            </Checkbox>
          );
        })}
      </div>
    </div>
  );
}

export default Features;

