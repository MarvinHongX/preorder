<script setup>
const { deliveryInfoUrl, reserveFundsUrl } = useImg();

</script>
<template>
<div class="mt-8 p-4 border rounded-lg bg-[#FFFFFF]">
    <div class="flex items-center mb-2">
        <img :src="deliveryInfoUrl" alt="배송 안내" class="mr-2 w-[19px]" />
        <h2 class="text-[16px] font-medium">배송 안내</h2>
    </div>
    <p class="text-[15px] font-light">사전예약 기간 종료 후 일괄 배송하며, 제조사 상황 및 수입 절차와 국내 전파 인증 등에 따라 구체적인 배송일정은 추후 공지하겠습니다.</p>
    <hr class="my-8 border-t border-gray-300" />
    <div class="flex items-center mb-2 mt-4">
        <img :src="reserveFundsUrl" alt="유보금" class="mr-2 w-[19px]" />
        <h2 class="text-[16px] font-medium">유보금</h2>
    </div>
    <p class="text-[15px] font-light">최초 판매 5건에 대한 수수료는 50% 지급하고, 나머지 50%는 유보금으로 남겨둡니다. 사전판매 종료하고 제 품 배송 후 고객의 주문취소 여부에 따라 유보금에 반영하여 지급합니다.</p>
</div>
</template>