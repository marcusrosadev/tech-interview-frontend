import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import MatchProgressBar from '@components/shared/MatchProgressBar';
import { getIconComponent } from '@utils/iconMapper';
import type { Recommendation } from '@appTypes';

interface RecommendationListProps {
  recommendations?: Recommendation[];
  selectedPreferences?: string[];
  selectedFeatures?: string[];
}

/**
 * Componente para exibir a lista de produtos recomendados
 */
function RecommendationList({
  recommendations = [],
  selectedPreferences = [],
  selectedFeatures = [],
}: RecommendationListProps) {
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const hasRecommendations = recommendations.length > 0;

  const toggleExpanded = (productId: number): void => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  // Variantes de animação para os cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-rd-dark">Lista de Recomendações</h2>

      {!hasRecommendations && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500 italic text-lg">
            Nenhuma recomendação encontrada. Selecione suas preferências e funcionalidades para
            receber recomendações personalizadas.
          </p>
        </div>
      )}

      {hasRecommendations && (
        <motion.ul
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {recommendations.map((recommendation, index) => {
            const matchInfo = recommendation.matchInfo || {
              score: 0,
              preferenceMatches: 0,
              featureMatches: 0,
              matchingPreferences: [],
              matchingFeatures: [],
            };
            const isExpanded = expandedProductId === recommendation.id;
            const hasMatches = matchInfo.score > 0;
            const totalSelected = selectedPreferences.length + selectedFeatures.length;

            return (
              <motion.li
                key={recommendation.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-rd-cyan transition-all duration-300 overflow-hidden"
              >
                <div
                  className="cursor-pointer p-5"
                  onClick={() => toggleExpanded(recommendation.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpanded(recommendation.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Nome do Produto */}
                      <div className="flex items-center gap-3 mb-2">
                        {/* Ícone do Produto */}
                        {getIconComponent(recommendation.icon, 'w-7 h-7 text-rd-cyan flex-shrink-0')}
                        <h3 className="font-bold text-xl text-rd-dark">{recommendation.name}</h3>
                        {/* Ícone de Status - Apenas se pontuação > 0 */}
                        {hasMatches && (
                          <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                        )}
                      </div>

                      {/* Badge de Categoria */}
                      {recommendation.category && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rd-cyan-light text-rd-dark">
                            {recommendation.category}
                          </span>
                        </div>
                      )}

                      {/* Pontuação Total e Detalhada */}
                      {matchInfo.score !== undefined && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">Pontuação:</span>
                            <span className="px-3 py-1 bg-rd-cyan-light text-rd-dark rounded-full text-sm font-bold">
                              {matchInfo.score}
                            </span>
                          </div>
                          {/* Pontuação Detalhada */}
                          <div className="text-xs text-gray-600">
                            {matchInfo.preferenceMatches} Preferência{matchInfo.preferenceMatches !== 1 ? 's' : ''} /{' '}
                            {matchInfo.featureMatches} Funcionalidade{matchInfo.featureMatches !== 1 ? 's' : ''}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ícone de Expandir */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDownIcon className="w-6 h-6 text-gray-500" />
                    </motion.div>
                  </div>
                </div>

                {/* Conteúdo Expandido */}
                {isExpanded && matchInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 bg-gray-50"
                  >
                    <div className="p-5 space-y-4">
                      {/* Lista de Matches */}
                      {(matchInfo.matchingPreferences?.length > 0 ||
                        matchInfo.matchingFeatures?.length > 0) && (
                        <div className="space-y-4">
                          {matchInfo.matchingPreferences && matchInfo.matchingPreferences.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-600 mb-2">
                                Preferências que deram match:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {matchInfo.matchingPreferences.map((preference: string, index: number) => (
                                  <span
                                    key={`pref-${index}`}
                                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1.5"
                                  >
                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                    {preference}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {matchInfo.matchingFeatures && matchInfo.matchingFeatures.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-600 mb-2">
                                Funcionalidades que deram match:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {matchInfo.matchingFeatures.map((feature: string, index: number) => (
                                  <span
                                    key={`feat-${index}`}
                                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1.5"
                                  >
                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Barras de Progresso */}
                      {matchInfo.preferenceMatches !== undefined &&
                        matchInfo.featureMatches !== undefined &&
                        totalSelected > 0 && (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-rd-dark mb-3 text-center">
                              Visualização da Pontuação
                            </h4>
                            <MatchProgressBar
                              preferenceMatches={matchInfo.preferenceMatches}
                              featureMatches={matchInfo.featureMatches}
                              maxPreferences={selectedPreferences.length}
                              maxFeatures={selectedFeatures.length}
                            />
                          </div>
                        )}
                    </div>
                  </motion.div>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}

export default RecommendationList;
