<script setup>
import axios from 'axios';
import { ref,onMounted ,computed} from 'vue';
import Table from '@/components/Table.vue';
import search from '@/components/search.vue';
const data=ref([])


onMounted(async() => {
    const res=await axios.get('https://uzanet.duckdns.org/payments')
    data.value=res.data
    console.log(data.value)
    
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
        <Table title="Payment Records" :rows="rows" :columns="columns"></Table>

    </main>
</template>