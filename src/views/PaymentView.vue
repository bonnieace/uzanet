<script setup>
import axios from 'axios';
import { ref,onMounted ,computed} from 'vue';
import Table from '@/components/Table.vue';
import search from '@/components/search.vue';
import { useMainStore } from '@/stores/store';
import customLoader from '@/components/customLoader.vue';
const store=useMainStore()
const data=ref([])



onMounted(async() => {
    store.setLoading(true);
   try {
    const res=await axios.get('https://uzanet.duckdns.org/payments')
    data.value=res.data
    console.log(data.value)
    
   } catch (error) {
       console.error('Error fetching payment records:', error);
    
   }finally{
       store.setLoading(false)
   }
    
})

const rows=computed(()=>{
    return data.value


})

const columns=computed(()=>{
    if (data.value && data.value.length > 0) {
        return Object.keys(data.value[0]);
    }
    return [];
    
})
</script>
<template>
    <main class="content">
        <customLoader  v-if="store.isLoading"/>

        <Table title="Payment Records" :rows="rows" :columns="columns" v-else></Table>

    </main>
</template>