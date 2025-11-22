/**
 * Interface para um produto
 */
export interface Product {
  id: number;
  name: string;
  category: string;
  preferences: string[];
  features: string[];
}

/**
 * Informações de match de um produto
 */
export interface MatchInfo {
  score: number;
  preferenceMatches: number;
  featureMatches: number;
  matchingPreferences: string[];
  matchingFeatures: string[];
}

/**
 * Produto recomendado com informações de match
 */
export interface Recommendation extends Product {
  matchInfo: MatchInfo;
}

/**
 * Dados do formulário
 */
export interface FormData {
  selectedPreferences: string[];
  selectedFeatures: string[];
  selectedRecommendationType: string;
}

/**
 * Resultado do cálculo de pontuação
 */
export interface ScoreData {
  score: number;
  preferenceMatches: number;
  featureMatches: number;
  matchingPreferences: string[];
  matchingFeatures: string[];
}

