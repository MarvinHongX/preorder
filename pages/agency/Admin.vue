<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { getOrders, getAgencys } from '@/commons/commonService';

definePageMeta({
    middleware: ['auth', 'admin-only']
});

const { authAgency } = await useAgency()

const loading1 = ref(false);
const loading2 = ref(false);
const page = ref(1)
const pageCount = 1000
const selectedFilter = ref('all');
const orders = ref([]);
const agencys = ref([]);
const selectedAgency = ref('');



const filteredOrders = computed(() => {
  let filtered = orders.value;

  if (selectedFilter.value === 'pending') {
    filtered = filtered.filter(order => order.depositStatus !== 'Y');
  }

  if (selectedAgency.value) {
    filtered = filtered.filter(order => order.referralCode === selectedAgency.value);
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
  return filteredOrders.value.slice((page.value - 1) * pageCount, page.value * pageCount);
});

const agencyCnt = computed(() => {
  if (!authAgency.value) return 0;
  return agencys.value.length;
});

const customerOrderCnt = computed(() => {
  return orders.value.reduce((total, order) => total + order.orderQuantity, 0);
});
const pendingPaymentCnt = computed(() => orders.value.filter(order => order.depositStatus !== 'Y').length);

const reserveFunds = computed(() => {
  const agencyOrderQuantities = {};

  orders.value.forEach(order => {
    if (!agencyOrderQuantities[order.referralCode]) {
      agencyOrderQuantities[order.referralCode] = 0;
    }

    agencyOrderQuantities[order.referralCode] += order.orderQuantity;
    if (agencyOrderQuantities[order.referralCode] > 5) {
      agencyOrderQuantities[order.referralCode] = 5;
    }
  });

  return Object.values(agencyOrderQuantities).reduce((total, qty) => {
    return total + (qty * 1000000);
  }, 0);
});

const shouldShowAgencyCell = (index) => {
  if (index === 0) return true;
  return rows.value[index].agencyName !== rows.value[index - 1].agencyName;
};

const getRowSpan = (index) => {
  const currentAgencyName = rows.value[index].agencyName;
  let span = 1;

  for (let i = index + 1; i < rows.value.length; i++) {
    if (rows.value[i].agencyName === currentAgencyName) {
      span++;
    } else {
      break;
    }
  }

  return span;
};

const agencySubtotals = computed(() => {
  const subtotals = {};
  
  orders.value.forEach(order => {
    if (!subtotals[order.referralCode]) {
      subtotals[order.referralCode] = 0;
    }
    subtotals[order.referralCode] += order.orderQuantity;
  });

  return subtotals;
});

watch(authAgency, (newAgency) => {
  if (newAgency) {
    getOrders(loading1, orders);
  }
}, { immediate: true });

onMounted(() => {
  getAgencys(loading2, agencys);
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
      관리자: {{ authAgency.name }} {{  formatPhoneNumber(authAgency.phoneNumber) }}
    </p>
    <AdminSummary 
      :agencyCnt="agencyCnt" 
      :reserveFunds="reserveFunds" 
      :customerOrderCnt="customerOrderCnt" 
      :pendingPaymentCnt="pendingPaymentCnt" 
    />

    <hr class="my-12 border-t border-gray-300" v-if="orders.length > 0"/>

    <div class="flex sm:flex-row flex-col overflow-x-auto text-[13px]">
      <div v-if="!loading2" class="mt-4 pr-10 flex flex-row">
        <label for="agency-select" class="p-2 border rounded">에이전시</label>
        <select 
          id="agency-select" 
          v-model="selectedAgency" 
          class="px-2 py-2 w-[180px] border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">전체</option>
          <option v-for="agency in agencys" :key="agency.referralCode" :value="agency.referralCode">
            {{ agency.name }} ({{ formatPhoneNumber(agency.phoneNumber) }})
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
          <option value="pending">입금대기</option>
        </select>
      </div>
    </div>
    <div class="min-h-lg">
      <div class="overflow-x-auto">
        <table 
          v-if="filteredOrders.length > 0"
          class="min-w-full mt-4 border"
          style="width: 650px;">
          <thead>
            <tr class="bg-[#FFFFFF]">
              <th class="text-[14px] font-medium border px-4 py-2">에이전시</th>
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
                <div>{{ order.agencyName }}</div>
                <div>{{ formatPhoneNumber(order.agencyPhoneNumber) }}</div>
              </td>
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
            
            <tr v-if="index === rows.length - 1 || rows[index + 1].agencyName !== order.agencyName" :key="order.seq + '-subtotal'">
              <td colspan="2" class="text-right font-bold py-2">소 계:</td>
              <td class="font-bold px-2 py-2">{{ agencySubtotals[order.referralCode] }}대</td>
              <td colspan="2"></td>
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
  </div>
</template>

<style scoped>
.p-error {
  color: red;
}

</style>
