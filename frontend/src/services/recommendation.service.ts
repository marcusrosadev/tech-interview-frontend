import { RECOMMENDATION_TYPES } from '@constants/recommendationTypes';
import type { Product, Recommendation, FormData, ScoreData } from '@appTypes';

/**
 * Calcula a pontuação e matches detalhados de um produto
 */
const calculateProductScore = (
  product: Product,
  selectedPreferences: string[],
  selectedFeatures: string[]
): ScoreData => {
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

/**
 * Filtra produtos que têm pelo menos um match com as preferências ou features selecionadas
 */
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

/**
 * Ordena produtos por pontuação (maior primeiro) mantendo índice original
 * Em caso de empate, mantém a ordem original (estável sort)
 */
const sortProductsByScore = (
  products: Product[],
  selectedPreferences: string[],
  selectedFeatures: string[]
): Recommendation[] => {
  // Cria uma cópia dos produtos com seus índices originais e informações de matches
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

  // Ordena por pontuação decrescente, mantendo ordem original em empates
  productsWithIndex.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Em caso de empate, mantém a ordem original (último na lista original fica por último)
    return 0;
  });

  // Retorna os produtos com informações de matches
  return productsWithIndex.map((item) => item.product);
};

/**
 * Seleciona o melhor produto para recomendação única
 * Em caso de empate na pontuação, retorna o último produto da lista original que atende aos critérios
 */
const selectBestProduct = (
  sortedProducts: Recommendation[],
  originalProducts: Product[],
  selectedPreferences: string[],
  selectedFeatures: string[]
): Recommendation[] => {
  if (sortedProducts.length === 0) {
    return [];
  }

  // Calcula a pontuação máxima (do primeiro produto ordenado)
  const maxScore = sortedProducts[0]?.matchInfo?.score || 0;

  // Filtra produtos com pontuação máxima
  const productsWithMaxScore = sortedProducts.filter((product) => {
    return product.matchInfo?.score === maxScore;
  });

  // Se há empate (mais de um produto com pontuação máxima), retorna o último da lista original
  if (productsWithMaxScore.length > 1) {
    // Encontra o último produto na lista original que tem pontuação máxima
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

  // Se não há empate, retorna o primeiro (maior pontuação)
  return [sortedProducts[0]];
};

/**
 * Seleciona múltiplos produtos que atendem aos critérios
 * Retorna todos os produtos que têm pelo menos um match, ordenados por pontuação
 */
const selectMultipleProducts = (sortedProducts: Recommendation[]): Recommendation[] => {
  return sortedProducts;
};

/**
 * Obtém recomendações de produtos baseado nas preferências e features selecionadas
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

  // Filtra produtos que atendem aos critérios
  const matchingProducts = filterMatchingProducts(
    products,
    selectedPreferences,
    selectedFeatures
  );

  if (matchingProducts.length === 0) {
    return [];
  }

  // Ordena produtos por pontuação
  const sortedProducts = sortProductsByScore(
    matchingProducts,
    selectedPreferences,
    selectedFeatures
  );

  // Seleciona produtos conforme o tipo de recomendação
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

