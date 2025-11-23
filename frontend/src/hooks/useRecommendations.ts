import { useState } from 'react';
import recommendationService from '@services/recommendation.service';
import type { Product, Recommendation, FormData } from '@appTypes';

interface UseRecommendationsReturn {
  recommendations: Recommendation[];
  getRecommendations: (formData: FormData) => Recommendation[];
  setRecommendations: (recommendations: Recommendation[]) => void;
}

function useRecommendations(products: Product[]): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const getRecommendations = (formData: FormData): Recommendation[] => {
    if (!products || products.length === 0) {
      return [];
    }

    return recommendationService.getRecommendations(formData, products);
  };

  return {
    recommendations,
    getRecommendations,
    setRecommendations,
  };
}

export default useRecommendations;

