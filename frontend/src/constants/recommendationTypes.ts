/**
 * Tipos de recomendação disponíveis no sistema
 */
export const RECOMMENDATION_TYPES = {
  SINGLE_PRODUCT: 'SingleProduct',
  MULTIPLE_PRODUCTS: 'MultipleProducts',
} as const;

/**
 * Tipo para os valores de RECOMMENDATION_TYPES
 */
export type RecommendationType = typeof RECOMMENDATION_TYPES[keyof typeof RECOMMENDATION_TYPES];

/**
 * Labels dos tipos de recomendação para exibição na UI
 */
export const RECOMMENDATION_TYPE_LABELS: Record<RecommendationType, string> = {
  [RECOMMENDATION_TYPES.SINGLE_PRODUCT]: 'Produto Único',
  [RECOMMENDATION_TYPES.MULTIPLE_PRODUCTS]: 'Múltiplos Produtos',
};

