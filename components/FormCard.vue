<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-[#F9F9F9] shadow-lg rounded-lg px-4 pt-8 pb-8">
      <h2 v-if="title" class="text-center text-xl font-semibold mb-4">{{ title }}</h2>
      <slot></slot>
    </div>
  </div>
</template>


<style scoped>
</style>
