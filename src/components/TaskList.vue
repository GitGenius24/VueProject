<script setup>
import { useTaskStore } from '../Stores/taskStore.js';
import TaskCard from './TaskCard.vue';
import { computed } from 'vue';

const taskStore = useTaskStore();
const tasksToDisplay = computed(() => taskStore.filteredTasks);
</script>

<template>
  <div class="task-list-container">
    <div v-if="taskStore.isLoading" class="loading-message">Loading tasks...</div>
    <div v-else-if="tasksToDisplay.length" class="tasks-grid">
      <TaskCard 
        v-for="task in tasksToDisplay" 
        :key="task.id" 
        :task="task" 
      />
    </div>
    <div v-else class="no-tasks-message">No tasks found.</div>
  </div>
</template>

<style scoped>
.task-list-container {
    max-width: 1200px; 
    padding: 0 10px;
    max-height: 80vh; 
    overflow-y: auto; 
    background-color: #e9ecef; 
    border-radius: 10px;
    padding: 15px;
}

.tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
    gap: 20px; 
}

.loading-message, .no-tasks-message {
    padding: 30px;
    margin: 20px 0;
    text-align: center;
    border: 1px dashed #ccc;
    border-radius: 8px;
    background-color: #fff;
    color: #888;
    font-size: 1.1em;
}

.loading-message {
    font-weight: bold;
    color: #4CAF50; 
}
</style>