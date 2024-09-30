<script setup>
const props = defineProps({
    myOrderCnt: {
        type: Number,
        required: true
    },
    reserveFunds: {
        type: Number,
        required: true
    },
    customerOrderCnt: {
        type: Number,
        required: true
    },
    pendingPaymentCnt: {
        type: Number,
        required: true
    }
});
const { myOrderUrl, reserveFundsUrl, customerOrderUrl, pendingPaymentUrl } = useImg();
</script>

<template>
  <div class="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2">
    <div class="p-4 border bg-[#FFFFFF] text-center">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <img :src="myOrderUrl" alt="my order icon" class="mr-2 w-6 h-6"/>
          <h3 class="text-sm">본인주문</h3>
        </div>
        <p class="m-1 text-m sm:text-sm">{{ props.myOrderCnt }}</p>
      </div>
    </div>

    <div class="p-4 border bg-[#FFFFFF] text-center">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <img :src="reserveFundsUrl" alt="reserve funds icon" class="mr-2 w-6 h-6"/>
          <h3 class="text-sm">유보금</h3>
        </div>
        <p class="m-1 text-m sm:text-sm">{{ props.reserveFunds.toLocaleString() }}원</p>
      </div>
    </div>

    <div class="p-4 border bg-[#FFFFFF] text-center">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <img :src="customerOrderUrl" alt="customer order icon" class="mr-2 w-6 h-6"/>
          <h3 class="text-sm">고객주문</h3>
        </div>
        <p class="m-1 text-m sm:text-sm">{{ props.customerOrderCnt }}</p>
      </div>
    </div>

    <div class="p-4 border bg-[#FFFFFF] text-center">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <img :src="pendingPaymentUrl" alt="pending payment icon" class="mr-2 w-6 h-6"/>
          <h3 class="text-sm">입금대기</h3>
        </div>
        <p class="m-1 text-m sm:text-sm">{{ props.pendingPaymentCnt }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

img {
  display: inline-block;
  vertical-align: middle;
}
</style>
