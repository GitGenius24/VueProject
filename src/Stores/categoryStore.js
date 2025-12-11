import { defineStore } from 'pinia';
import api from '../Services/api.js';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await api.get('/categories?order=name.asc');
        this.categories = response.data;
        return response.data; 
      } catch (error) {
        this.error = 'Failed to fetch categories.';
        console.error('Error fetching categories:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  getters: {
    getCategoryById: (state) => (id) => {
      return state.categories.find(c => c.id === id);
    }
  }
});