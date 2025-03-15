<script setup>
import { ref, computed,watch } from 'vue';
const emit = defineEmits(['updateFilteredList']);

const props = defineProps({
    title: {
        type: String,
        default: 'Add Client'
    },
    clicked: {
        type: Function,
        required: true
    },
    list: {
        type: Array,
        required: true
    },
    searchKeys: {
        type: Array,
        default: () => ['phone_number'] // Default to searching by phone number
    }
});

const searchTerm = ref('');

const filteredList = computed(() => {
    if (!Array.isArray(props.list) || props.list.length === 0) return [];

    return props.list.filter(item => 
        props.searchKeys.some(key => 
            item[key] && String(item[key]).toLowerCase().includes(searchTerm.value.toLowerCase())
        )
    );
});
// Watch for changes in filteredList and emit the new list
watch(filteredList, (newList) => {
    emit('updateFilteredList', newList);
});
</script>

<template>
    <div class="search-add-client">
        <div class="search-bar">
            <input 
                type="text" 
                id="search-input" 
                placeholder="Enter search terms (e.g., name, phone number, etc.)" 
                v-model="searchTerm"
            >
            <button id="search-button"><i class="fas fa-search"></i></button>  
        </div>
        <button id="add-client-button" class="add-client-button" @click="props.clicked">
            <i class="fas fa-plus"></i> {{ props.title }}
        </button>
        
    </div>
</template>
