<script setup>
import { ref, onMounted, watch } from 'vue';
import { useTaskStore } from '../Stores/taskStore.js';
import { useCategoryStore } from '../Stores/categoryStore.js';

const taskStore = useTaskStore();
const categoryStore = useCategoryStore();

const props = defineProps({
  initialTask: {
     type: Object,
     default: () => null,
   },
});

const emit = defineEmits(['task-saved', 'cancel']);

// 💡 2. متغيرات الحالة
const taskData = ref({});
const errors = ref({});
const isSubmitting = ref(false);


const initializeForm = (task) => {

     if (task) {
       taskData.value = {
             id: task.id,
             title: task.title || '',
             description: task.description || '',
             category_id: task.category_id || null,
             priority: task.priority || 'medium',
             due_date: task.due_date ? task.due_date.substring(0, 10) : '', 
             image_url: task.image_url || '',
      };
     } else {
         taskData.value = {
             title: '',
             description: '',
             category_id: null,
             priority: 'medium',
             due_date: '',
             image_url: '',
       };
     } errors.value = {}; };

// 💡 4. Validation 
const validateForm = () => {
   errors.value = {};
   if (!taskData.value.title.trim()) {
     errors.value.title = 'Title is required.';
   }
   if (taskData.value.category_id === null || taskData.value.category_id === undefined) { 
   errors.value.category = 'Category is required.';
   }
   return Object.keys(errors.value).length === 0;
};


// 💡 5. دالة الإرسال الموحدة (CREATE و UPDATE)
const handleSubmit = async () => {
   if (!validateForm()) {
   return;
   }

   isSubmitting.value = true;
   
   try {
   if (taskData.value.id) {
     await taskStore.updateTask(taskData.value.id, taskData.value);
     alert('Task updated successfully!');
   } else {
     await taskStore.createTask(taskData.value); 
     alert('Task created successfully!');
    }
   
   await taskStore.fetchTasks();
   emit('task-saved'); 

   } catch (err) {
   errors.value.api = `Failed to ${taskData.value.id ? 'update' : 'create'} task.`;
   console.error('Task operation failed:', err);
   } finally {
   isSubmitting.value = false;
   }
};


// 💡 6. الـ Watcher والـ Lifecycle Hooks
watch(() => props.initialTask, (newVal) => {
   initializeForm(newVal);
}, { immediate: true }); 

onMounted(() => {
   initializeForm(props.initialTask); 
});
</script>

<template>
  <div class="task-form-container">
    <h2 class="form-title">{{ taskData.id ? 'Edit Task' : 'Add New Task' }}</h2>
    
    <div v-if="errors.api" class="api-error-message">
        {{ errors.api }}
    </div>

    <form @submit.prevent="handleSubmit">
      
      <div class="form-group">
        <label for="title" class="form-label">Title <span class="required-star">*</span></label>
        <input 
          type="text" 
          id="title" 
          v-model="taskData.title" 
          :class="{'input-error': errors.title}"
          class="form-input" 
        />
        <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
      </div>

      <div class="form-group">
        <label for="category" class="form-label">Category <span class="required-star">*</span></label>
        <select 
          id="category" 
          v-model.number="taskData.category_id" 
          :class="{'input-error': errors.category}"
          class="form-input"
        >
          <option :value="null" disabled>Select a Category</option>
          <option 
            v-for="category in categoryStore.categories" 
            :key="category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <p v-if="errors.category" class="error-text">{{ errors.category }}</p>
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Description</label>
        <textarea 
          id="description" 
          v-model="taskData.description" 
          rows="3"
          class="form-input"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="priority" class="form-label">Priority</label>
        <select 
          id="priority" 
          v-model="taskData.priority" 
          class="form-input"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div class="form-group">
        <label for="dueDate" class="form-label">Due Date</label>
        <input 
          type="date" 
          id="dueDate" 
          v-model="taskData.due_date" 
          class="form-input" 
        />
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          @click="emit('cancel')" 
          :disabled="isSubmitting"
          class="btn-cancel"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="btn-submit"
        >
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Save Task</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.task-form-container {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    max-width: 600px;
    margin: 30px auto;
}

.form-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 25px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.api-error-message {
    margin-bottom: 20px;
    padding: 12px;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24; 
    border-radius: 6px;
    font-weight: 500;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    color: #495057;
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 0.95rem;
}

.required-star {
    color: #e74c3c; 
    font-weight: 700;
}

.form-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: vertical; 
}

.form-input:focus {
    border-color: #007bff; 
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: none;
}

.input-error {
    border-color: #e74c3c; 
}

.error-text {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 5px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
}

.btn-cancel, .btn-submit {
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, opacity 0.2s;
}

.btn-cancel {
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    color: #495057;
}

.btn-cancel:hover {
    background-color: #e2e6ea;
}

.btn-submit {
    background-color: #28a745;
    border: 1px solid #28a745;
    color: white;
}

.btn-submit:hover:not(:disabled) {
    background-color: #218838;
}

.btn-submit:disabled {
    background-color: #90ee90; 
    cursor: not-allowed;
    opacity: 0.8;
}
</style>
