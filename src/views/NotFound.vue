<template>
    <div class="not-found">
        <i class="fas fa-exclamation-triangle"></i>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button @click="goHome">Back to Home</button>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
    methods: {
        goHome() {
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    animation: fadeIn 1s ease-in-out;
}

.not-found i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #ff6f61;
}

.not-found h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.not-found p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.not-found button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.not-found button:hover {
    background-color: #0056b3;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
