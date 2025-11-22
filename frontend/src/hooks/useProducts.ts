import { useEffect, useState } from 'react';
import getProducts from '@services/product.service';
import type { Product } from '@appTypes';

interface UseProductsReturn {
  preferences: string[];
  features: string[];
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * Hook customizado para gerenciar produtos, preferências e features
 * Carrega os produtos do servidor e extrai preferências e features únicas
 */
const useProducts = (): UseProductsReturn => {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    /**
     * Carrega produtos do servidor e processa preferências e features
     */
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const productsData = await getProducts();
        const allPreferences: string[] = [];
        const allFeatures: string[] = [];

        setProducts(productsData);

        // Extrai preferências e features de todos os produtos
        productsData.forEach((product) => {
          // Seleciona 2 preferências aleatórias de cada produto
          const productPreferences = product.preferences
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
          allPreferences.push(...productPreferences);

          // Seleciona 2 features aleatórias de cada produto
          const productFeatures = product.features
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
          allFeatures.push(...productFeatures);
        });

        setPreferences(allPreferences);
        setFeatures(allFeatures);
      } catch (err) {
        console.error('Erro ao obter os produtos:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    preferences,
    features,
    products,
    // isLoading e error podem ser usados para melhorar UX no futuro
    // isLoading,
    // error,
  };
};

export default useProducts;

