<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
import AppGoto from './AppGoto.vue';

const scrollDirection = ref('up');

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const handleScroll = () => {
    if (window.scrollY > 0) {
        scrollDirection.value = 'down';
    } else {
        scrollDirection.value = 'up';
    }
};
</script>

<template>
    <div class="layout-wrapper">
        <app-topbar v-if="scrollDirection === 'up'"></app-topbar>
        <div class="layout-main-container">
            <div class="layout-main px-4 py-6">
                <NuxtPage />
            </div>
            <app-footer></app-footer>
        </div>
    </div>
    <app-goto :simple="scrollDirection == 'up'"></app-goto>
</template>

<style scoped>
.layout-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.layout-main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.layout-main {
    flex-grow: 1;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>