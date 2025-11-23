import { RECOMMENDATION_TYPES } from '@constants/recommendationTypes';
import type { Product, Recommendation, FormData, ScoreData } from '@appTypes';

const calculateProductScore = (
  product: Product,
  selectedPreferences: string[],
  selectedFeatures: string[]
): ScoreData => {
  // Pontuação calculada pela contagem simples de matches (Preferências + Funcionalidades)
  const matchingPreferences = product.preferences.filter((preference: string) =>
    selectedPreferences.includes(preference)
  );
  const preferenceMatches = matchingPreferences.length;

  const matchingFeatures = product.features.filter((feature: string) =>
    selectedFeatures.includes(feature)
  );
  const featureMatches = matchingFeatures.length;

  return {
    score: preferenceMatches + featureMatches,
    preferenceMatches,
    featureMatches,
    matchingPreferences,
    matchingFeatures,
  };
};

const filterMatchingProducts = (
  products: Product[],
  selectedPreferences: string[],
  selectedFeatures: string[]
): Product[] => {
  if (selectedPreferences.length === 0 && selectedFeatures.length === 0) {
    return [];
  }

  return products.filter((product) => {
    const hasPreferenceMatch =
      selectedPreferences.length > 0 &&
      product.preferences.some((preference: string) => selectedPreferences.includes(preference));

    const hasFeatureMatch =
      selectedFeatures.length > 0 &&
      product.features.some((feature: string) => selectedFeatures.includes(feature));

    return hasPreferenceMatch || hasFeatureMatch;
  });
};

const sortProductsByScore = (
  products: Product[],
  selectedPreferences: string[],
  selectedFeatures: string[]
): Recommendation[] => {
  const productsWithIndex = products.map((product) => {
    const scoreData = calculateProductScore(product, selectedPreferences, selectedFeatures);
    return {
      product: {
        ...product,
        matchInfo: {
          score: scoreData.score,
          preferenceMatches: scoreData.preferenceMatches,
          featureMatches: scoreData.featureMatches,
          matchingPreferences: scoreData.matchingPreferences,
          matchingFeatures: scoreData.matchingFeatures,
        },
      },
      score: scoreData.score,
    };
  });

  productsWithIndex.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return 0;
  });

  return productsWithIndex.map((item) => item.product);
};

const selectBestProduct = (
  sortedProducts: Recommendation[],
  originalProducts: Product[],
  selectedPreferences: string[],
  selectedFeatures: string[]
): Recommendation[] => {
  if (sortedProducts.length === 0) {
    return [];
  }

  const maxScore = sortedProducts[0]?.matchInfo?.score || 0;

  const productsWithMaxScore = sortedProducts.filter((product) => {
    return product.matchInfo?.score === maxScore;
  });

  // Regra do Critério de Aceite: Em caso de empate na pontuação máxima, retorna o último produto válido da lista original
  if (productsWithMaxScore.length > 1) {
    for (let i = originalProducts.length - 1; i >= 0; i--) {
      const product = originalProducts[i];
      const scoreData = calculateProductScore(product, selectedPreferences, selectedFeatures);
      if (scoreData.score === maxScore) {
        return [
          {
            ...product,
            matchInfo: {
              score: scoreData.score,
              preferenceMatches: scoreData.preferenceMatches,
              featureMatches: scoreData.featureMatches,
              matchingPreferences: scoreData.matchingPreferences,
              matchingFeatures: scoreData.matchingFeatures,
            },
          },
        ];
      }
    }
  }

  return [sortedProducts[0]];
};

const selectMultipleProducts = (sortedProducts: Recommendation[]): Recommendation[] => {
  return sortedProducts;
};

/**
 * Calcula e retorna recomendações de produtos baseado nas seleções do usuário.
 *
 * @param formData - Dados do formulário contendo preferências selecionadas, funcionalidades selecionadas e tipo de recomendação (SingleProduct ou MultipleProducts)
 * @param products - Array de produtos disponíveis para análise
 * @returns Array de produtos recomendados ordenados por pontuação (maior primeiro). Para SingleProduct retorna um único produto; para MultipleProducts retorna todos os produtos com matches, ordenados.
 */
const getRecommendations = (formData: FormData | null, products: Product[]): Recommendation[] => {
  if (!formData || !products || products.length === 0) {
    return [];
  }

  const {
    selectedPreferences = [],
    selectedFeatures = [],
    selectedRecommendationType,
  } = formData;

  const matchingProducts = filterMatchingProducts(
    products,
    selectedPreferences,
    selectedFeatures
  );

  if (matchingProducts.length === 0) {
    return [];
  }

  const sortedProducts = sortProductsByScore(
    matchingProducts,
    selectedPreferences,
    selectedFeatures
  );

  if (selectedRecommendationType === RECOMMENDATION_TYPES.SINGLE_PRODUCT) {
    return selectBestProduct(
      sortedProducts,
      matchingProducts,
      selectedPreferences,
      selectedFeatures
    );
  }

  if (selectedRecommendationType === RECOMMENDATION_TYPES.MULTIPLE_PRODUCTS) {
    return selectMultipleProducts(sortedProducts);
  }

  return [];
};

const recommendationService = {
  getRecommendations,
};

export default recommendationService;

