import React, { useState } from 'react';
import { ToastProvider } from '@hooks/useToast';
import Form from '@components/Form/Form';
import RecommendationList from '@components/RecommendationList/RecommendationList';
import type { Recommendation, FormData } from '@appTypes';

/**
 * Componente principal da aplicação
 * Gerencia o estado das recomendações e coordena a comunicação entre Form e RecommendationList
 */
function App() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [formData, setFormData] = useState<Pick<FormData, 'selectedPreferences' | 'selectedFeatures'>>({
    selectedPreferences: [],
    selectedFeatures: [],
  });

  /**
   * Handler para atualizar as recomendações quando o formulário é submetido
   */
  const handleRecommendationsChange = (
    newRecommendations: Recommendation[],
    submittedFormData: FormData
  ): void => {
    setRecommendations(newRecommendations || []);
    if (submittedFormData) {
      setFormData({
        selectedPreferences: submittedFormData.selectedPreferences || [],
        selectedFeatures: submittedFormData.selectedFeatures || [],
      });
    }
  };

  /**
   * Handler para resetar as recomendações quando o formulário é resetado
   */
  const handleReset = (): void => {
    setRecommendations([]);
    setFormData({
      selectedPreferences: [],
      selectedFeatures: [],
    });
  };

  return (
    <ToastProvider>
      <div className="bg-rd-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - centralizado na tela toda */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-rd-dark mb-4">
            Recomendador de Produtos RD Station
          </h1>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            Bem-vindo ao Recomendador de Produtos RD Station. Aqui você pode encontrar uma
            variedade de produtos da RD Station, cada um projetado para atender às necessidades
            específicas do seu negócio. De CRM a Marketing, de Conversas a Inteligência
            Artificial, temos uma solução para ajudar você a alcançar seus objetivos. Use o
            formulário abaixo para selecionar suas preferências e funcionalidades desejadas e
            receba recomendações personalizadas de produtos que melhor atendam às suas
            necessidades.
          </p>
        </div>

          {/* Layout Horizontal: Form à esquerda, Recomendações à direita em telas grandes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Formulário */}
            <div className="order-2 lg:order-1">
              <Form
                onRecommendationsChange={handleRecommendationsChange}
                onReset={handleReset}
              />
            </div>

            {/* Lista de Recomendações */}
            <div className="order-1 lg:order-2">
              <RecommendationList
                recommendations={recommendations}
                selectedPreferences={formData.selectedPreferences}
                selectedFeatures={formData.selectedFeatures}
              />
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;

