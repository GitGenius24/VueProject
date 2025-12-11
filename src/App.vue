<script setup>
import { ref, onMounted } from 'vue'; 
import { useCategoryStore } from './stores/categoryStore.js';
import { useTaskStore } from './stores/taskStore.js';
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';
import TaskDetails from './components/TaskDetails.vue'; 

const categoryStore = useCategoryStore();
const taskStore = useTaskStore();

const isFormVisible = ref(false); 

const showForm = () => {
    isFormVisible.value = true;
    taskStore.currentTask = null; 
};

const hideForm = () => {
    isFormVisible.value = false;
};

onMounted(async () => {
    try {
        await categoryStore.fetchCategories();
    } catch (err) {
        console.error('Failed to fetch categories:', err);
    }
    
    try {
        await taskStore.fetchTasks();
    } catch (err) {
        console.error('Failed to fetch tasks:', err);
    }
});
</script>

<template>
  <div id="app" class="app-container">
    
    <header class="app-header">
      <h1 class="header-title">Vue Task Manager</h1>
    </header>

    <main class="main-content"> 
        <div class="task-area">
            
            <div v-if="isFormVisible">
                <TaskForm @task-saved="hideForm" @cancel="hideForm" />
            </div>
            
            <div v-else-if="taskStore.currentTask">
                <TaskDetails @close="taskStore.currentTask = null" />
            </div>
            
            <div v-else>
                <button 
                    @click="showForm" 
                    class="btn-add-task"
                >
                    + Add New Task
                </button>
                <TaskList />
            </div>
        </div>
    </main>
  </div>
</template>

<style scoped>

.app-container {
    background-color: #f4f7f9; 
    min-height: 100vh;
    padding: 30px 0; 
}


.app-header {
    margin-bottom: 40px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e0e0e0;
    text-align: center;
}

.header-title {
    font-size: 3rem;
    font-weight: 800;
    color: #34495e; 
    letter-spacing: -0.5px;
}

.main-content {
    
    max-width: 1400px; 
    margin-left: auto; 
    margin-right: auto; 
    padding: 0 25px; 
}



.btn-add-task {
    display: block; 
    width: fit-content; 
    margin: 0 auto 20px auto; 
    
    padding: 12px 25px;
    background-color: #3498db; 
    color: white;
    font-weight: 700;
    font-size: 1.05rem;
    border: none;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4); 
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
}

.btn-add-task:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 7px 18px rgba(52, 152, 219, 0.6);
}


.task-area {
    padding-top: 20px;
}
</style>