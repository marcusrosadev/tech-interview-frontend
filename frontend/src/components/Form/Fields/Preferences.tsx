import React, { useState, useEffect, useRef } from 'react';
import Checkbox from '@components/shared/Checkbox';

interface PreferencesProps {
  preferences: string[];
  selectedPreferences?: string[];
  onPreferenceChange: (preferences: string[]) => void;
}

/**
 * Compara dois arrays de strings para verificar se são iguais
 */
const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

/**
 * Componente para seleção de preferências
 */
function Preferences({
  preferences,
  selectedPreferences = [],
  onPreferenceChange,
}: PreferencesProps) {
  const [currentPreferences, setCurrentPreferences] = useState<string[]>(selectedPreferences);
  const prevSelectedRef = useRef<string[]>(selectedPreferences);

  useEffect(() => {
    // Só atualiza se o array realmente mudou (comparação profunda)
    if (!arraysEqual(prevSelectedRef.current, selectedPreferences)) {
      setCurrentPreferences(selectedPreferences);
      prevSelectedRef.current = selectedPreferences;
    }
  }, [selectedPreferences]);

  /**
   * Handler para mudança de preferência individual
   */
  const handlePreferenceChange = (preference: string): void => {
    const updatedPreferences = currentPreferences.includes(preference)
      ? currentPreferences.filter((pref) => pref !== preference)
      : [...currentPreferences, preference];

    setCurrentPreferences(updatedPreferences);
    onPreferenceChange(updatedPreferences);
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Preferências:</h2>
      <div className="space-y-2">
        {preferences.map((preference, index) => {
          // Usa uma combinação de preference + index para criar key única
          // Em produção, preferências deveriam ter IDs únicos
          const uniqueKey = `preference-${preference}-${index}`;
          return (
            <Checkbox
              key={uniqueKey}
              value={preference}
              checked={currentPreferences.includes(preference)}
              onChange={() => handlePreferenceChange(preference)}
            >
              {preference}
            </Checkbox>
          );
        })}
      </div>
    </div>
  );
}

export default Preferences;

