<script setup>
import { RouterLink } from 'vue-router';

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

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileDropdown.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mobileDropdown.contains(e.target)) {
            mobileDropdown.classList.remove('active');
        }
    });

    

  
});
</script>
<template>
           <div class="sidebar" id="sidebar">
            <div class="logo">
                <h1><i class="fas fa-chart-line"></i> <span>UzaNet</span></h1>
            </div>
            <nav>
                <ul>
                    <li><RouterLink to="/" class="active"><i class="fas fa-home"></i> <span>Dashboard</span></RouterLink></li>
                    <li><RouterLink to="clients"><i class="fas fa-users"></i> <span>PPPoE</span></RouterLink></li>
        
                    <li><RouterLink to="hotspot" ><i class="fas fa-wifi"></i> <span>Hotspot</span></RouterLink></li>
                    <li><RouterLink to="plans"><i class="fas fa-list-alt"></i> <span>Plans</span></RouterLink></li>
                    <li><RouterLink to="reports"><i class="fas fa-chart-bar"></i> <span>Reports</span></RouterLink></li>
                    <li><RouterLink to="settings"><i class="fas fa-cog"></i> <span>Settings</span></RouterLink></li>
                </ul>
            </nav>
        </div>

</template>