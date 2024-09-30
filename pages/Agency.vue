<script setup>
import { ref, computed, watch } from 'vue';
import { getOrdersByAgency } from '@/commons/commonService';

definePageMeta({
    middleware: ['auth','agency-only']
});

const { authAgency } = await useAgency()

const loading1 = ref(false);
const page = ref(1)
const pageCount = 10
const selectedFilter = ref('all');
const orders = ref([]);


const referralLink = computed(() => {
  return authAgency.value && authAgency.value.referralCode
    ? `https://labemall.co.kr/preorder/${authAgency.value.referralCode}`
    : '';
});



const filteredOrders = computed(() => {
  let filtered = orders.value;

  if (selectedFilter.value === 'pending') {
    filtered = filtered.filter(order => order.depositStatus !== 'Y');
  }
  return filtered.sort((a, b) => {
    const dateA = new Date(a.ordDt);
    const dateB = new Date(b.ordDt);
    
    if (dateB.getTime() !== dateA.getTime()) {
      return dateB.getTime() - dateA.getTime();
    }

    return b.seq - a.seq;
  });
});



const rows = computed(() => {
  return orders.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const myOrderCnt = computed(() => {
  if (!authAgency.value) return 0;
  return orders.value.reduce((total, order) => {
    if (
      order.name === authAgency.value.name &&
      order.phoneNumber === authAgency.value.phoneNumber
    ) {
      return total + order.orderQuantity;
    }
    return total;
  }, 0);
});

const customerOrderCnt = computed(() => {
  return orders.value.reduce((total, order) => total + order.orderQuantity, 0) - myOrderCnt.value;
});

const pendingPaymentCnt = computed(() => {
  return orders.value.reduce((total, order) => {
    if (order.depositStatus !== 'Y') {
      return total + order.orderQuantity;
    }
    return total;
  }, 0);
});


const reserveFunds = computed(() => {
  if (!authAgency.value) return 0;

  const sortedOrders = [...orders.value]
    .filter(order => order.agencyId === authAgency.value.id) // Ensure it's for the current agency
    .sort((a, b) => {
      const dateA = new Date(a.ordDt);
      const dateB = new Date(b.ordDt);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      return a.seq - b.seq;
    });

  let totalOrderQuantity = 0;
  let totalReserveFunds = 0;

  for (const order of sortedOrders) {
    const remainingQuantity = 5 - totalOrderQuantity;
    if (order.orderQuantity <= remainingQuantity) {
      totalOrderQuantity += order.orderQuantity;
      totalReserveFunds += order.orderQuantity * 1000000;
    } else {
      totalReserveFunds += remainingQuantity * 1000000; 
      break; 
    }
  }

  return totalReserveFunds;
});


watch(authAgency, (newAgency) => {
  if (newAgency && newAgency.referralCode) {
    getOrdersByAgency(newAgency.referralCode, loading1, orders);
  }
}, { immediate: true });

onMounted(() => {
  reserveFunds.value; 
});

</script>

<template>
  <div 
    v-if="!loading1" 
    class="bg-[#F9F9F9] max-w-lg mx-auto px-4 pt-8 pb-8 mb-4 "
  >
    <p
      v-if="authAgency"
    >
      에이전시: {{ authAgency.name }} {{  formatPhoneNumber(authAgency.phoneNumber) }}
    </p>
    <AgencySummary 
      :myOrderCnt="myOrderCnt" 
      :reserveFunds="reserveFunds" 
      :customerOrderCnt="customerOrderCnt" 
      :pendingPaymentCnt="pendingPaymentCnt" 
    />
    <AgencyInfo 
      :authAgency="authAgency" 
      :referralLink="referralLink"
    />
    <hr class="my-12 border-t border-gray-300" v-if="orders.length > 0"/>
    <div class="mt-4 flex items-center">
    <label class="flex items-center">
      <input 
        v-model="selectedFilter" 
        type="radio" 
        value="all"
        class="custom-checkbox mr-2"
      />
      <span>전체</span>
    </label>

    <label class="flex items-center ml-4">
      <input 
        v-model="selectedFilter" 
        type="radio"
        value="pending"
        class="custom-checkbox mr-2"
      />
      <span>입금대기</span>
    </label>
  </div>

    <div class="min-h-lg">
      <div class="overflow-x-auto"> 
        <table 
          v-if="filteredOrders.length > 0"
          class="min-w-full mt-4 border"
          style="width: 450px;">
          <thead>
            <tr class="bg-[#FFFFFF]">
              <th class="text-[14px] font-medium border px-4 py-2">고객정보</th>
              <th class="text-[14px] font-medium border px-4 py-2">주문정보</th>
              <th class="text-[14px] font-medium border px-4 py-2">결제여부</th>
              <th class="text-[14px] font-medium border px-4 py-2">배송여부</th>
            </tr>
          </thead>
          <tbody class="bg-[#FFFFFF] text-[15px] font-light">
            <tr v-if="loading1">
              <td colspan="4" class="text-center">loading...</td>
            </tr>
            <tr v-for="order in rows" :key="order.seq">
              <td class="text-[14px] border px-4 py-2">
                <div>{{ order.name }}</div>
                <div>{{ formatPhoneNumber(order.phoneNumber) }}</div>
              </td>
              <td class="text-[14px] border px-4 py-2">
                <div>{{ order.ordDt }}</div>
                <div>{{ order.orderQuantity }}대</div>
              </td>
              <td class="text-[14px] border px-4 py-2">{{ order.depositStatus === 'Y' ? '입금완료' : '대기' }}</td>
              <td class="text-[14px] border px-4 py-2">{{ order.depositStatus === 'Y' ? '배송완료' : '추후 공지' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div 
        v-if="filteredOrders.length > 0"
        class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
      >
        <UPagination v-model="page" :page-count="pageCount" :total="filteredOrders.length" />
      </div>
    </div>
    <hr class="my-12 border-t border-gray-300"/>
    <AgencyDeliveryInfo />
  </div>
</template>

<style scoped>
.p-error {
  color: red;
}
.custom-checkbox {
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #BDBDBD;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  cursor: pointer;
}
.custom-checkbox:checked {
  background-color: white;
  border-color: #BDBDBD;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  background:#6627AA;
}
</style>
