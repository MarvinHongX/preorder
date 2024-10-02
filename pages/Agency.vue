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
const customers = ref([]);
const selectedCustomer = ref('');


const referralLink = computed(() => {
  return authAgency.value && authAgency.value.referralCode
    ? `https://labemall.co.kr/preorder/${authAgency.value.referralCode}`
    : '';
});


const filteredOrders = computed(() => {
  let filtered = orders.value;

  if (selectedFilter.value === 'pending') {
    filtered = filtered.filter(order => order.depositStatus !== 'Y');
  } else if (selectedFilter.value === 'completed') {
    filtered = filtered.filter(order => order.depositStatus === 'Y');
  }
  if (selectedCustomer.value) {
    filtered = filtered.filter(order => order.phoneNumber === selectedCustomer.value);
  }
  return filtered.sort((a, b) => {
    // 이름에 따라 정렬
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return -1; // nameA가 nameB보다 앞에 오는 경우
    if (nameA > nameB) return 1;  // nameA가 nameB보다 뒤에 오는 경우

    // 이름이 같은 경우 전화번호에 따라 정렬
    const phoneA = a.phoneNumber.replace(/\D/g, ''); // 전화번호에서 숫자만 추출
    const phoneB = b.phoneNumber.replace(/\D/g, '');
    if (phoneA < phoneB) return -1;
    if (phoneA > phoneB) return 1;
    
    // 마지막으로 ordDt와 seq를 기준으로 내림차순 정렬
    const dateA = new Date(a.ordDt);
    const dateB = new Date(b.ordDt);
    
    if (dateB.getTime() !== dateA.getTime()) {
      return dateB.getTime() - dateA.getTime();
    }

    return b.seq - a.seq;
  });
});

const rows = computed(() => {
  return filteredOrders.value.slice((page.value - 1) * pageCount, page.value * pageCount);
});


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

const shouldShowAgencyCell = (index) => {
  if (index === 0) return true;
  return rows.value[index].name !== rows.value[index - 1].name;
};

const getRowSpan = (index) => {
  const currentName = rows.value[index].name;
  let span = 1;

  for (let i = index + 1; i < rows.value.length; i++) {
    if (rows.value[i].name === currentName) {
      span++;
    } else {
      break;
    }
  }

  return span;
};

watch(authAgency, (newAgency) => {
  if (newAgency && newAgency.referralCode) {
    getOrdersByAgency(newAgency.referralCode, loading1, orders, customers);
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
    <div class="flex sm:flex-row flex-col overflow-x-auto text-[13px] gap-2">
      <div v-if="!loading1" class="mt-4 flex flex-row">
        <label for="customer-select" class="p-2 border rounded">고객정보</label>
        <select 
          id="customer-select" 
          v-model="selectedCustomer" 
          class="px-2 py-2 w-[180px] border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">전체</option>
          <option v-for="customer in customers" :key="customer.phoneNumber" :value="customer.phoneNumber">
            {{ customer.name }} ({{ formatPhoneNumber(customer.phoneNumber) }})
          </option>
        </select>
      </div>

      <div class="mt-4 flex flex-row">
        <label for="filter-select" class="p-2 border rounded">결제여부</label>
        <select 
          id="filter-select"
          v-model="selectedFilter"
          class="px-2 py-2 w-[100px] border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">전체</option>
          <option value="pending">대기</option>
          <option value="completed">입금완료</option>
          
        </select>
      </div>
    </div>

    <!-- <div class="mt-4 flex items-center">
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
      <span>대기</span>
    </label>
    <label class="flex items-center ml-4">
      <input 
        v-model="selectedFilter" 
        type="radio"
        value="completed"
        class="custom-checkbox mr-2"
      />
      <span>입금완료</span>
    </label>
  </div> -->
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
            <template v-for="(order, index) in rows" :key="order.seq">
              <tr>
                <td 
                  v-if="shouldShowAgencyCell(index)"
                  :rowspan="getRowSpan(index)"
                  class="text-[14px] border px-4 py-2"
                >
                  <div>{{ order.name }}</div>
                  <div>{{ formatPhoneNumber(order.phoneNumber) }}</div>
                </td>
                <td class="text-[14px] border px-4 py-2">
                  <div>{{ order.ordDt }}</div>
                  <div>{{ order.orderQuantity }}대</div>
                </td>
                <td class="text-[14px] border px-4 py-2">{{ order.depositStatus === 'Y' ? '입금완료' : '대기' }}</td>
                <td class="text-[14px] border px-4 py-2">{{ order.deliveryStatus === 'Y' ? '배송완료' : '추후 공지' }}</td>
              </tr>
            </template>
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
