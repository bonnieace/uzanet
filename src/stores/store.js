import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMainStore = defineStore('main', () => {
    const showModal = ref(false);
    const isLoading= ref(true);
    const filteredData = ref([]); // Holds the filtered data
    const setLoading = (value) => {
        console.log('loading status:', value);
        isLoading.value = value;
    };
    
    const openModal = () => {
        console.log('clicked')
        showModal.value = true;
    };
    
    const closeModal = () => {
        showModal.value = false;
    };
    // Handle the filtered list update from the Search component
    const handleFilteredListUpdate = (updatedList) => {
        filteredData.value = updatedList;
    };

    return {
        showModal,
        isLoading,
        filteredData,
        handleFilteredListUpdate,
        setLoading,
        openModal,
        closeModal,
    };
});