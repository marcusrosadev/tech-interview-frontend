import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface RadarChartProps {
  preferenceMatches: number;
  featureMatches: number;
  maxPreferences: number;
  maxFeatures: number;
}

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

/**
 * Componente de Gráfico de Radar para visualizar pontuação de matches
 */
function RadarChartComponent({ preferenceMatches, featureMatches, maxPreferences, maxFeatures }: RadarChartProps) {
  // Normaliza os valores para o gráfico (0-100)
  const maxValue = Math.max(maxPreferences, maxFeatures, 1);
  const normalizedPreferences = maxPreferences > 0 ? (preferenceMatches / maxPreferences) * 100 : 0;
  const normalizedFeatures = maxFeatures > 0 ? (featureMatches / maxFeatures) * 100 : 0;

  const data: RadarData[] = [
    {
      subject: 'Preferências',
      A: normalizedPreferences,
      fullMark: 100,
    },
    {
      subject: 'Funcionalidades',
      A: normalizedFeatures,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full">
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#002233', fontSize: 12, fontWeight: 600 }}
              className="text-xs"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Matches"
              dataKey="A"
              stroke="#7BE1C5"
              fill="#7BE1C5"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#002233' }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {/* Legenda Detalhada */}
      <div className="mt-4 p-4 bg-rd-white rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm font-semibold text-rd-dark mb-1">Preferências</div>
            <div className="text-lg font-bold text-rd-cyan">
              {preferenceMatches}/{maxPreferences}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {maxPreferences > 0 ? Math.round(normalizedPreferences) : 0}% de match
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-rd-dark mb-1">Funcionalidades</div>
            <div className="text-lg font-bold text-rd-cyan">
              {featureMatches}/{maxFeatures}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {maxFeatures > 0 ? Math.round(normalizedFeatures) : 0}% de match
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RadarChartComponent;
