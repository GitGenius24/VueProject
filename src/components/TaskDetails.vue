<script setup>
import { ref, watch, computed } from 'vue';
import { useTaskStore } from '../Stores/taskStore.js';
import { useCategoryStore } from '../Stores/categoryStore.js';
import TaskForm from './TaskForm.vue'; 

const taskStore = useTaskStore();
const categoryStore = useCategoryStore();
const emit = defineEmits(['close']);

const isEditing = ref(false);
const localTask = ref({});

const categoryInfo = computed(() => 
 categoryStore.getCategoryById(taskStore.currentTask?.category_id)
);

watch(() => taskStore.currentTask, (newTask) => { if (newTask) {
 localTask.value = { ...newTask };
 }
}, { immediate: true });


const handleDelete = async () => {
 if (confirm('Are you sure you want to delete this task?')) {
    try {
        await taskStore.deleteTask(taskStore.currentTask.id);
         emit('close'); 
        } catch (error) {
 alert('Failed to delete task.');
 }
 }
};

const startEdit = () => {
    isEditing.value = true;
};

const handleUpdateComplete = () => {
     isEditing.value = false;
};

</script>

<template>
  <div class="task-details-modal">
    
    <div v-if="isEditing">
        <TaskForm :initial-task="localTask" @task-saved="handleUpdateComplete" @cancel="isEditing = false" />
    </div>

    <div v-else-if="taskStore.currentTask">
        <button @click="emit('close')" class="close-button">
            &times;
        </button>

        <header class="details-header">
            <div>
                <h1 class="details-title">{{ taskStore.currentTask.title }}</h1>
                <span :class="{'status-completed': taskStore.currentTask.completed, 'status-pending': !taskStore.currentTask.completed}" 
                      class="status-tag">
                    {{ taskStore.currentTask.completed ? 'Completed' : 'Pending' }}
                </span>
            </div>
        </header>

        <section class="details-section">
            <h2 class="section-title">Details</h2>
            <div class="details-content">
                
                <p v-if="taskStore.currentTask.description">
                    <span class="detail-label">Description:</span>
                    {{ taskStore.currentTask.description }}
                </p>
                <p>
                    <span class="detail-label">Priority:</span> {{ taskStore.currentTask.priority }}
                </p>
                <p v-if="taskStore.currentTask.due_date">
                    <span class="detail-label">Due Date:</span> {{ taskStore.currentTask.due_date }}
                </p>
                
                <div v-if="taskStore.currentTask.image_url" class="image-wrapper">
                    <span class="detail-label">Image:</span>
                    <img :src="taskStore.currentTask.image_url" alt="Task Image" class="detail-image" />
                </div>
            </div>
        </section>

        <footer class="details-footer">
            
            <button 
                @click="taskStore.updateTask(taskStore.currentTask.id, { completed: !taskStore.currentTask.completed })"
                :class="taskStore.currentTask.completed ? 'btn-pending' : 'btn-complete'"
                class="action-button"
            >
                {{ taskStore.currentTask.completed ? 'Mark as Pending' : 'Mark as Completed' }}
            </button>
            
            <button 
                @click="startEdit"
                class="action-button btn-edit"
            >
                Edit
            </button>
            
            <button 
                @click="handleDelete"
                class="action-button btn-delete"
            >
                Delete
            </button>
        </footer>
    </div>
  </div>
</template>

<style scoped>
.task-details-modal {
    background-color: #ffffff;
    padding: 35px;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    position: relative;
    max-width: 700px;
    margin: 50px auto;
}

.close-button {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    font-size: 2rem;
    color: #aaa;
    cursor: pointer;
    transition: color 0.2s;
}
.close-button:hover {
    color: #333;
}

.details-header {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.details-title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
}

.status-tag {
    font-size: 0.9rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 15px;
    color: white;
}

.status-completed { background-color: #5cb85c; } 
.status-pending { background-color: #f0ad4e; } 
.details-section {
    margin-bottom: 30px;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #555;
    margin-bottom: 15px;
}

.details-content p {
    margin-bottom: 10px;
    line-height: 1.6;
}

.detail-label {
    font-weight: 700;
    color: #333;
    display: inline-block;
    min-width: 100px; 
}

.image-wrapper {
    margin-top: 15px;
}

.detail-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.details-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.action-button {
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-complete { background-color: #5cb85c; } 
.btn-complete:hover { background-color: #4cae4c; }

.btn-pending { background-color: #f0ad4e; } 
.btn-pending:hover { background-color: #ec971f; }

.btn-edit { background-color: #007bff; }
.btn-edit:hover { background-color: #0056b3; }

.btn-delete { background-color: #d9534f; }
.btn-delete:hover { background-color: #c9302c; }
</style>