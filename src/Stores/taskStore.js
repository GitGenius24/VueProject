import { defineStore } from 'pinia';
import api from '../Services/api.js';

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    currentTask: null,
    isLoading: false,
    error: null,
    filterBy: { category_id: null, search: '', completed: null },
  }),

  getters: {
    filteredTasks: (state) => {
        return state.tasks;
    }
  },

  actions: {
   setCurrentTask(task) {
        this.currentTask = task;
    },
    async fetchTasks() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await api.get('/tasks?order=created_at.desc'); 
        this.tasks = response.data;
      } catch (error) {
        this.error = 'Failed to fetch tasks.';
        console.error('Error fetching tasks:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async createTask(taskData) {
      this.error = null;
      try {
        const response = await api.post('/tasks', taskData);
        this.tasks.unshift(response.data[0]); 
        return response.data[0];
      } catch (error) {
        this.error = 'Failed to create task.';
        throw error; 
      }
    },
    
    async updateTask(id, updatedData) {
      this.error = null;
      try {
        const response = await api.patch(`/tasks?id=eq.${id}`, updatedData);
        const updatedTask = response.data[0];

        const index = this.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...updatedTask };
        }
        
        if (this.currentTask && this.currentTask.id === id) {
            this.currentTask = updatedTask;
        }

        return updatedTask;
      } catch (error) {
        this.error = 'Failed to update task.';
        throw error;
      }
    },
    
    async deleteTask(id) {
      this.error = null;
      try {
        await api.delete(`/tasks?id=eq.${id}`);

        this.tasks = this.tasks.filter(t => t.id !== id);
        
        if (this.currentTask && this.currentTask.id === id) {
            this.currentTask = null;
        }

      } catch (error) {
        this.error = 'Failed to delete task.';
        throw error;
      }
    }
  },
});