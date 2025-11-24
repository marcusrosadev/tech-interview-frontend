import React from 'react';

interface MatchProgressBarProps {
  preferenceMatches: number;
  featureMatches: number;
  maxPreferences: number;
  maxFeatures: number;
}

function MatchProgressBar({
  preferenceMatches,
  featureMatches,
  maxPreferences,
  maxFeatures,
}: MatchProgressBarProps) {
  const preferencePercentage =
    maxPreferences > 0 ? Math.round((preferenceMatches / maxPreferences) * 100) : 0;
  const featurePercentage =
    maxFeatures > 0 ? Math.round((featureMatches / maxFeatures) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Preferências Match</span>
          <span
            className={`text-sm font-semibold ${
              preferencePercentage === 0 ? 'text-gray-400' : 'text-rd-cyan'
            }`}
          >
            {preferencePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-rd-cyan h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${preferencePercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-right">
          {preferenceMatches} de {maxPreferences} preferências
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Funcionalidades Match</span>
          <span
            className={`text-sm font-semibold ${
              featurePercentage === 0 ? 'text-gray-400' : 'text-rd-cyan'
            }`}
          >
            {featurePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-rd-cyan h-full rounded-full transition-all duration-500 ease-out"
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
