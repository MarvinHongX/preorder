<script setup>

definePageMeta({
    layout: false,
    middleware: ['auth']
});
</script>

<template>
    <div class="page-container">
        <div class="content-wrapper">
            <div class="gradient-border">
                <div class="card-content">
                    <span class="error-code">404</span>
                    <h1 class="error-title">Not Found</h1>
                    <div class="error-message">Requested resource is not available.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-width: 100vw;
    overflow: hidden;
    background-color: var(--surface-ground);
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.gradient-border {
    border-radius: 56px;
    padding: 0.3rem;
    background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%);
}

.card-content {
    width: 100%;
    background-color: var(--surface-card);
    padding: 2rem 1.25rem;
    border-radius: 53px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.error-code {
    color: var(--blue-500);
    font-weight: bold;
    font-size: 3rem;
}

.error-title {
    color: var(--text-900);
    font-weight: bold;
    font-size: 3rem;
    margin-bottom: 0.5rem;
}

.error-message {
    color: var(--text-600);
    margin-bottom: 1.25rem;
}

@media (min-width: 992px) {
    .card-content {
        padding: 2rem 2rem;
    }

    .error-title {
        font-size: 5rem;
    }
}
</style>
