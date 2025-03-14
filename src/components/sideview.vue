<script setup>
import { RouterLink,useRoute } from 'vue-router';
const route=useRoute()

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth > 768) {
        sidebar.addEventListener('mouseenter', () => {
            sidebar.classList.add('expanded');
        });

        sidebar.addEventListener('mouseleave', () => {
            sidebar.classList.remove('expanded');
        });
    }

   

    

  
});
</script>
<template>
           <div class="sidebar" id="sidebar">
            <div class="logo">
                <h1><i class="fas fa-chart-line"></i> <span>UzaNet</span></h1>
            </div>
            <nav>
                <ul>
                    <li><RouterLink to="/" :class="{ active: route.path === '/' }"><i class="fas fa-home"></i> <span>Dashboard</span></RouterLink></li>
                    <li><RouterLink to="clients" :class="{ active: route.path === '/clients' }" ><i class="fas fa-users"></i> <span>PPPoE</span></RouterLink></li>
        
                    <li><RouterLink to="hotspot"  :class="{ active: route.path === '/hotspot' }" ><i class="fas fa-wifi"></i> <span>Hotspot</span></RouterLink></li>
                    <li><RouterLink to="plans" :class="{ active: route.path === '/plans' }" ><i class="fas fa-list-alt"></i> <span>Plans</span></RouterLink></li>
                    <li><RouterLink to="logs" :class="{ active: route.path === '/logs' }" ><i class="fas fa-chart-bar"></i> <span>Logs</span></RouterLink></li>
                    <li><RouterLink to="payments" :class="{ active: route.path === '/payments' }"><i class="fas fa-credit-card"></i> <span>Payments</span></RouterLink></li>
                    <li><RouterLink to="settings"  :class="{ active: route.path === '/settings' }" ><i class="fas fa-cog"></i> <span>Settings</span></RouterLink></li>
               
                </ul>
            </nav>
        </div>

</template>