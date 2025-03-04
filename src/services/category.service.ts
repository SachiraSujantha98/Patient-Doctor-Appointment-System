import { AxiosResponse } from 'axios';
import api from './api';
import { config } from '../config/env.config';
import { Category } from '../types';

class CategoryService {
  async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await api.get(
      config.apiEndpoints.categories.list
    );
    return response.data;
  }
}

export const categoryService = new CategoryService(); 