import React, { useState, useEffect, useRef } from 'react';
import Checkbox from '@components/shared/Checkbox';

interface FeaturesProps {
  features: string[];
  selectedFeatures?: string[];
  onFeatureChange: (features: string[]) => void;
}

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

function Features({ features, selectedFeatures = [], onFeatureChange }: FeaturesProps) {
  const [currentFeatures, setCurrentFeatures] = useState<string[]>(selectedFeatures);
  const prevSelectedRef = useRef<string[]>(selectedFeatures);

  useEffect(() => {
    if (!arraysEqual(prevSelectedRef.current, selectedFeatures)) {
      setCurrentFeatures(selectedFeatures);
      prevSelectedRef.current = selectedFeatures;
    }
  }, [selectedFeatures]);

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

