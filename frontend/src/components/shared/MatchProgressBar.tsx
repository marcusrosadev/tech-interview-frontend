import React from 'react';

interface MatchProgressBarProps {
  preferenceMatches: number;
  featureMatches: number;
  maxPreferences: number;
  maxFeatures: number;
}

/**
 * Componente de barras de progresso horizontais para visualizar pontuação de matches
 */
function MatchProgressBar({ preferenceMatches, featureMatches, maxPreferences, maxFeatures }: MatchProgressBarProps) {
  // Calcula as porcentagens (0-100)
  const preferencePercentage = maxPreferences > 0 ? (preferenceMatches / maxPreferences) * 100 : 0;
  const featurePercentage = maxFeatures > 0 ? (featureMatches / maxFeatures) * 100 : 0;

  return (
    <div className="w-full space-y-4">
      {/* Barra de Preferências */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-rd-dark">Preferências Match (%)</span>
          <span className="text-sm font-bold text-indigo-600">
            {Math.round(preferencePercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${preferencePercentage}%` }}
          />
        </div>
      </div>

      {/* Barra de Funcionalidades */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-rd-dark">Funcionalidades Match (%)</span>
          <span className="text-sm font-bold text-indigo-600">
            {Math.round(featurePercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${featurePercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default MatchProgressBar;

