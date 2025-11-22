import axios from 'axios';
import type { Product } from '@appTypes';

const baseURL = 'http://localhost:3001';

/**
 * Obtém a lista de produtos da API
 * @returns Promise com array de produtos
 */
const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${baseURL}/products`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter os produtos:', error);
    throw error;
  }
};

export default getProducts;

