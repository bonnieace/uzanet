<script setup>
import { ref, computed, watch } from 'vue';
import { Search as SearchIcon, Plus } from 'lucide-vue-next';
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
    <div class="neo-search-add">
        <div class="neo-search-bar">
            <input 
                type="text" 
                id="search-input" 
                placeholder="SEARCH..." 
                v-model="searchTerm"
                class="neo-input neo-search-input"
            />
            <button class="neo-btn neo-btn-primary search-button">
                <SearchIcon :size="16" />
            </button>  
        </div>
        <button class="neo-btn neo-btn-primary add-client-button" @click="props.clicked">
            <Plus :size="16" /> {{ props.title }}
        </button>
    </div>
</template>

<style scoped>
.neo-search-add {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.neo-search-bar {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 1rem;
    min-width: 250px;
}

.neo-search-input {
    flex: 1;
    border: var(--border-width) solid var(--border) !important;
    box-shadow: 4px 4px 0px 0px var(--border) !important;
    padding: 0.75rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
}

.search-button {
    padding: 0.75rem 1.5rem;
    min-width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-client-button {
    padding: 0.75rem 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .neo-search-add {
        flex-direction: column;
    }

    .neo-search-bar {
        width: 100%;
    }

    .add-client-button {
        width: 100%;
        justify-content: center;
    }
}
</style>
