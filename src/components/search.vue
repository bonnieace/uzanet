<script setup>
const props=defineProps({
    title:{
        type:String,
        default:'add client'
    },
    clicked:{
        type:Function,
        required:true
    }

})
</script>

<template>
    <div class="search-add-client">
    <div class="search-bar">
        <input type="text" id="search-input" placeholder="ENTER SEARCH TERMS (EG: ONLINE, 192.168.0.)">
        <button id="search-button" ><i class="fas fa-search"></i></button>  
    </div>
    <button id="add-client-button" class="add-client-button" @click="props.clicked">
        <i class="fas fa-plus"></i> {{props.title}}
    </button>
</div>
</template>