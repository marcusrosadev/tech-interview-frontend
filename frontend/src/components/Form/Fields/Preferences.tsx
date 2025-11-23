import React, { useState, useEffect, useRef } from 'react';
import Checkbox from '@components/shared/Checkbox';

interface PreferencesProps {
  preferences: string[];
  selectedPreferences?: string[];
  onPreferenceChange: (preferences: string[]) => void;
}

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

function Preferences({
  preferences,
  selectedPreferences = [],
  onPreferenceChange,
}: PreferencesProps) {
  const [currentPreferences, setCurrentPreferences] = useState<string[]>(selectedPreferences);
  const prevSelectedRef = useRef<string[]>(selectedPreferences);

  useEffect(() => {
    if (!arraysEqual(prevSelectedRef.current, selectedPreferences)) {
      setCurrentPreferences(selectedPreferences);
      prevSelectedRef.current = selectedPreferences;
    }
  }, [selectedPreferences]);

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

