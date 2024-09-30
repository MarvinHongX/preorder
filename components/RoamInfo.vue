<script setup>
const props = defineProps({
    isInfoOpen: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const { expandUrl, foldUrl, roam01Url, roam02Url, roam03Url, roam04Url, roam05Url, roam06Url, roam07Url } = useImg();

const isInfoOpen = ref(props.isInfoOpen);

const toggleInfo = () => {
    isInfoOpen.value = !isInfoOpen.value;
};
</script>

<template>
    <div class="p-4 mb-2">
        <div class="">
            <NuxtImg format="webp" :src="roam01Url" alt="roam01"/>
        </div>
        <div class="mt-6">
            <NuxtImg format="webp" :src="roam02Url" alt="roam02"/>
        </div>
        <div v-if="isInfoOpen" class="mt-2">
            <NuxtImg format="webp" :src="roam03Url" alt="roam03"/>
        </div>
        <div v-if="isInfoOpen" class="mt-2">
            <NuxtImg format="webp" :src="roam04Url" alt="roam04"/>
        </div>
        <div v-if="isInfoOpen" class="mt-2">
            <NuxtImg format="webp" :src="roam05Url" alt="roam05"/>
        </div>
        <div v-if="isInfoOpen" class="mt-2">
            <NuxtImg format="webp" :src="roam06Url" alt="roam06"/>
        </div>
        <div v-if="isInfoOpen" class="mt-2">
            <NuxtImg format="webp" :src="roam07Url" alt="roam07"/>
        </div>
    </div>
    <button @click="toggleInfo" class="border border-[#707070] p-4 mb-8 w-full flex items-center justify-center hover:bg-gray-200">
        <span class="text-[#707070] mr-2">
        {{ isInfoOpen ? '상품정보 접기' : '상품정보 더보기' }}
        </span>
        <img 
            :src="isInfoOpen ? foldUrl : expandUrl"
            alt="Toggle Details"
            class="w-[12px] h-[6px]"
        />
    </button>
</template>


<style scoped>
</style>
