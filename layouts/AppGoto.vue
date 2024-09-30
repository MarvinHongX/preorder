<script setup>
const { gotoUrl } = useImg();

defineProps({
    simple: {
        type: Boolean,
        default: false
    }
});

const onGotoButtonClick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

</script>

<template>
    <div class="fixed right-3 bottom-20 z-50">
        <button 
            v-if="!simple" 
            class="bg-[#FFFFFF] flex flex-row text-[#1F2226] border border-[#707070] rounded p-2 mb-4 mt-4 hover:bg-[#E0E0E0] transition-colors"
             @click="onGotoButtonClick()"
        >
            <img :src="gotoUrl" alt="goto" class="m-1 h-[14px]" />
            <h2 class="text-[14px] font-medium">맨위로</h2>
        </button>
    </div>
</template>

<style scoped>

</style>