<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { LayoutDashboard, Users, Wifi, Layers, Terminal, CreditCard, Zap, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next';
import { useMainStore } from '@/stores/store';
const route = useRoute();
const store = useMainStore();
const expanded = ref(true);

const toggle = () => {
  expanded.value = !expanded.value;
  store.sidebarExpanded = expanded.value;
};

const navItems = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients',  icon: Users,           label: 'PPPoE' },
  { to: '/hotspot',  icon: Wifi,            label: 'Hotspot' },
  { to: '/plans',    icon: Layers,          label: 'Plans' },
  { to: '/logs',     icon: Terminal,        label: 'Logs' },
  { to: '/payments', icon: CreditCard,      label: 'Payments' },
];
</script>

<template>
  <aside
    class="neo-sidebar"
    :class="{ 'neo-sidebar--expanded': expanded }"
  >
    <div class="neo-sidebar__logo">
      <Zap :size="22" class="neo-sidebar__logo-icon" />
      <span class="neo-sidebar__logo-text">UzaNet</span>
      <button class="neo-sidebar__toggle" @click="toggle" :title="expanded ? 'Collapse' : 'Expand'">
        <PanelLeftClose v-if="expanded" :size="18" />
        <PanelLeftOpen v-else :size="18" />
      </button>
    </div>

    <nav class="neo-sidebar__nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="neo-sidebar__link"
        :class="{ 'neo-sidebar__link--active': route.path === item.to }"
      >
        <component :is="item.icon" :size="20" class="neo-sidebar__icon" />
        <span class="neo-sidebar__label">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.neo-sidebar {
  position: fixed;
  top: 80px;
  left: 8px;
  height: calc(100vh - 88px);
  width: 72px;
  background-color: var(--card);
  border: var(--border-width) solid var(--border);
  box-shadow: 6px 6px 0px 0px var(--border);
  display: flex;
  flex-direction: column;
  z-index: 900;
  overflow: hidden;
  transition: width 0.2s ease;
}

.neo-sidebar--expanded {
  width: 220px;
}

.neo-sidebar__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.25rem;
  background: none;
  border: none;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.1s ease;
  margin-left: auto;
}

.neo-sidebar__toggle:hover {
  color: var(--primary);
}

.neo-sidebar:not(.neo-sidebar--expanded) .neo-sidebar__toggle {
  margin-left: 0;
  color: var(--primary);
  width: 100%;
  justify-content: center;
  padding: 0;
}

.neo-sidebar:not(.neo-sidebar--expanded) .neo-sidebar__logo {
  padding: 0;
  gap: 0;
  justify-content: center;
}

.neo-sidebar__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem 0 1.25rem;
  height: 64px;
  border-bottom: var(--border-width) solid var(--border);
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--primary);
  white-space: nowrap;
  overflow: hidden;
}

.neo-sidebar__logo-icon {
  flex-shrink: 0;
  transition: opacity 0.15s ease, width 0.2s ease;
}

.neo-sidebar:not(.neo-sidebar--expanded) .neo-sidebar__logo-icon {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
}

.neo-sidebar__logo-text {
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--foreground);
  flex: 1;
  width: 0;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.15s ease, width 0.2s ease;
}

.neo-sidebar--expanded .neo-sidebar__logo-text {
  width: auto;
  opacity: 1;
}

.neo-sidebar__nav {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 0.25rem;
  flex: 1;
  overflow: hidden;
}

.neo-sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: var(--foreground);
  text-decoration: none;
  white-space: nowrap;
  border-left: 3px solid transparent;
  transition: background-color 0.1s ease, border-color 0.1s ease;
  position: relative;
}

.neo-sidebar__link:hover {
  background-color: var(--muted);
  border-left-color: var(--primary);
}

.neo-sidebar__link--active {
  background-color: var(--primary);
  color: #fff;
  border-left-color: var(--border);
  box-shadow: inset -4px 0 0 0 var(--border);
}

.neo-sidebar__icon {
  font-size: 1rem;
  min-width: 20px;
  text-align: center;
}

.neo-sidebar__label {
  opacity: 0;
  transition: opacity 0.15s ease;
  overflow: hidden;
}

.neo-sidebar--expanded .neo-sidebar__label {
  opacity: 1;
}

@media (max-width: 768px) {
  .neo-sidebar {
    display: none;
  }
}
</style>