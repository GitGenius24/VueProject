<script setup>
import { useCategoryStore } from '../Stores/categoryStore.js';
import { useTaskStore } from '../Stores/taskStore.js';
import { computed } from 'vue';

const props = defineProps({
    task: {
        type: Object,
        required: true,
    },
});

const categoryStore = useCategoryStore();
const taskStore = useTaskStore();

const category = computed(() =>
    categoryStore.getCategoryById(props.task.category_id)
);

const categoryColor = computed(() => {
    return category.value ? category.value.color : '#9ca3af';
});

const handleCardClick = () => {
    taskStore.setCurrentTask(props.task);
};

</script>

<template>
  <div
    @click="handleCardClick"
    :class="{'task-completed': task.completed}" 
    :style="{ borderLeftColor: categoryColor }"
    class="task-card" 
  >
    <div class="card-header">
      <h3 class="card-title" :class="{'line-through-completed': task.completed}">
        {{ task.title }}
      </h3>
      <span
        class="category-tag"
        :style="{ backgroundColor: categoryColor }"
      >
        {{ category ? category.name : 'N/A' }}
      </span>
    </div>

    <div v-if="task.image_url" class="card-image-wrapper">
        <img :src="task.image_url" alt="Task Image" class="card-image" />
    </div>

    <p class="card-description">
      {{ task.description || 'No description provided.' }}
    </p>

    <div class="card-footer">
        <span v-if="task.priority" class="priority-status" :class="{'priority-high': task.priority === 'high'}">
            Priority: {{ task.priority }}
        </span>
        <span v-if="task.due_date" class="due-date">Due: {{ task.due_date }}</span>
    </div>
  </div>
</template>

<style scoped>
.task-card {
    background-color: #ffffff; 
    padding: 18px; 
    border-radius: 12px; 
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); 
    cursor: pointer;
    border-left: 6px solid transparent; 
    transition: all 0.2s ease-in-out; 
    height: 100%; 
}

.task-card:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15); 
    transform: translateY(-2px); 
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.card-title {
    font-size: 1.25rem; 
    font-weight: 700;
    color: #333;
    max-width: 70%; 
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.category-tag {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 15px;
    color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-image-wrapper {
    margin: 10px 0;
    border-radius: 8px;
    overflow: hidden;
}

.card-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
}

.card-description {
    font-size: 0.95rem;
    color: #666;
    margin-top: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
    font-size: 0.85rem;
    color: #888;
}

.task-completed {
    opacity: 0.7; 
}

.line-through-completed {
    text-decoration: line-through;
    color: #999;
}

.priority-high {
    color: #d9534f; 
    font-weight: 600;
}
</style>