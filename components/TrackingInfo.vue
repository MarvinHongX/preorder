<script setup>
const props = defineProps({
    orders: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <div v-if="orders.length > 0" class="mt-8 p-4 border rounded-lg bg-[#FFFFFF]">
        <div class="flex items-center mb-2">
            <h2 class="text-[16px] font-medium">주문자 정보</h2>
        </div>
        <div class="flex justify-between mb-2">
            <p class="text-[13px] font-light">이름: {{ orders[0].name }}</p>
            <p class="text-[13px] font-light">휴대전화: {{ formatPhoneNumber(orders[0].phoneNumber) }}</p>
        </div>
    </div>
</template>