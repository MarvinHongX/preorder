<script setup>
const { deliveryInfoUrl, refundPolicyUrl } = useImg();
const props = defineProps({
    orders: {
        type: Array,
        default: () => [],
    }
    });
</script>


<template>
    <div v-if="orders.length > 0" class="mt-8 p-4 border rounded-lg bg-[#FFFFFF]">
        <div class="flex items-center mb-2">
            <img :src="deliveryInfoUrl" alt="배송 안내" class="mr-2 w-[19px]" />
            <h2 class="text-[16px] font-medium">배송 안내</h2>
        </div>
        <p class="text-[15px] font-light">사전예약 기간 종료 후 일괄 배송하며, 제조사 상황 및 수입 절차와 국내 전파 인증 등에 따라 구체적인 배송일정은 추후 공지하겠습니다.</p>
        <hr class="my-8 border-t border-gray-300" />
        <div class="flex items-center mb-2 mt-4">
            <img :src="refundPolicyUrl" alt="환불 정책" class="mr-2 w-[19px]" />
            <h2 class="text-[16px] font-medium">환불 정책</h2>
        </div>
        <p class="text-[15px] font-light">제품 배송 후 7일 이내 단순변심에 의한 주문취소 시 위약금이 발생하며, 위약금 수수료율 20% 입니다. 7일 이후부터는 주문취소가 불가합니다.</p>
    </div>
</template>