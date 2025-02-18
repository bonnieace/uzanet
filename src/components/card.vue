<script setup>

const props=defineProps({
    icon:{
        type:String,
        default:'fas fa-wallet'

    },
    amount:{
    },
    title:{
        type:String,
        default:'title'
    },
    pay:{
        type:Boolean,
        default:true
    }


})
</script>
<template>
    <div class="card">
        <h3><i :class="props.icon"></i>{{ props.title }}</h3>
        <p v-if="props.pay">KES {{ props.amount }} </p>
        <p v-else>{{ props.amount }} Active</p>
            
    </div>
</template>
<style>
.card {
  background-color: var(--card-background);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card h3 {
  margin: 0 0 10px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
}

.card h3 i {
  color: var(--primary-color);
}

.card p {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--text-color);
}
</style>