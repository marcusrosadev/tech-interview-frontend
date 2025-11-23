import React from 'react';

interface MatchProgressBarProps {
  preferenceMatches: number;
  featureMatches: number;
  maxPreferences: number;
  maxFeatures: number;
}

/**
 * Componente para exibir barras de progresso horizontais
 * representando a porcentagem de matches de preferências e funcionalidades
 */
function MatchProgressBar({
  preferenceMatches,
  featureMatches,
  maxPreferences,
  maxFeatures,
}: MatchProgressBarProps) {
  // Calcula a porcentagem de matches
  const preferencePercentage =
    maxPreferences > 0 ? Math.round((preferenceMatches / maxPreferences) * 100) : 0;
  const featurePercentage =
    maxFeatures > 0 ? Math.round((featureMatches / maxFeatures) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Barra de Preferências */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Preferências Match</span>
          <span className="text-sm font-semibold text-indigo-600">{preferencePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${preferencePercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-right">
          {preferenceMatches} de {maxPreferences} preferências
        </div>
      </div>

      {/* Barra de Funcionalidades */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Funcionalidades Match</span>
          <span className="text-sm font-semibold text-indigo-600">{featurePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${featurePercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-right">
          {featureMatches} de {maxFeatures} funcionalidades
        </div>
      </div>
    </div>
  );
}

export default MatchProgressBar;
