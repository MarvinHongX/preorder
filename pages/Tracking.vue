<script setup>
import { ref, computed } from 'vue';
import { getOrdersByNameAndPhone } from '@/commons/commonService';

definePageMeta({
    middleware: ['auth']
});
const loading1 = ref(false);
const page = ref(1)
const pageCount = 5
const rows = computed(() => {
  return orders.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const name = ref('');
const phoneCountry = ref('+82');
const phoneNumber = ref('010');

const orders = ref([]);
const phoneCountries = usePhoneCountries();
const formattedPhone = computed({
  get() {
    return phoneNumber.value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  },
  set(value) {
    phoneNumber.value = value.replace(/-/g, '');
  }
});

const updatePhone = (event) => {
  formattedPhone.value = event.target.value;
};


const handleSubmit = () => {
  loading1.value = true;
  getOrdersByNameAndPhone(name, phoneCountry, phoneNumber, loading1, orders);
};

</script>

<template>
  <div 
    v-if="!loading1" 
    class="bg-[#F9F9F9] max-w-lg mx-auto px-4 pt-8 pb-8 mb-4 "
  >
    <form
      @submit.prevent="handleSubmit"
    >
    <h2 class="text-center text-xl font-semibold mb-4">주문내역 조회</h2>
      <div class="mb-12">
        <label for="name" class="mb-2 block text-gray-700 text-[16px]">이름</label>
        <input 
          v-model="name" 
          type="text"
          id="name"
          required
          class="border rounded p-2 w-full"
        />
      </div>
      <div class="mb-12">
        <label for="phone" class="mb-2 block text-gray-700 text-[16px]">휴대전화</label>
        <div class="flex mb-2">
          <select 
            v-model="phoneCountry" 
            id="phoneCountry" 
            required 
            class="border rounded p-2 mr-2 w-15"
          >
            <option v-for="country in phoneCountries" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </select>
          <input 
            v-model="formattedPhone"
            required
            type="text"
            id="phoneNumber"
            @input="updatePhone"
            maxlength="13"
            placeholder="숫자만 입력해주세요." 
            class="border rounded p-2 w-full"
          />
        </div>
      </div>
      <button 
        type="submit" 
        class="bg-[#832BEB] text-white rounded p-3 mb-16 w-full mt-4 hover:bg-[#6B21A8]"
      >
        조회하기
      </button>
    </form>
    <TrackingInfo :orders="orders" v-if="orders.length > 0"/>
    <hr class="my-12 border-t border-gray-300" v-if="orders.length > 0"/>
    <div class="min-h-lg">
      <div class="overflow-x-auto"> 
        <table 
          v-if="orders.length > 0"
          class="min-w-full mt-4 border"
          style="width: 350px;">
          <thead>
            <tr class="bg-[#FFFFFF]">
              <th class="text-[14px] font-medium border px-4 py-2">주문일</th>
              <th class="text-[14px] font-medium border px-4 py-2">수량</th>
              <th class="text-[14px] font-medium border px-4 py-2">결제여부</th>
              <th class="text-[14px] font-medium border px-4 py-2">배송여부</th>
            </tr>
          </thead>
          <tbody class="bg-[#FFFFFF] text-[15px] font-light">
            <tr v-if="loading1">
              <td colspan="4" class="text-center">loading...</td>
            </tr>
            <tr v-for="order in rows" :key="order.seq">
              <td class="text-[14px] border px-4 py-2">{{ order.ordDt }}</td>
              <td class="text-[14px] border px-4 py-2 text-right">{{ order.orderQuantity }}</td>
              <td class="text-[14px] border px-4 py-2">{{ order.depositStatus === 'Y' ? '입금완료' : '대기' }}</td>
              <td class="text-[14px] border px-4 py-2">{{ order.depositStatus === 'Y' ? '배송완료' : '추후 공지' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div 
        v-if="orders.length > 0"
        class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
      >
        <UPagination v-model="page" :page-count="pageCount" :total="orders.length" />
      </div>
    </div>
    <hr class="my-12 border-t border-gray-300" v-if="orders.length > 0"/>
    <DeliveryInfo :orders="orders" v-if="orders.length > 0"/>
  </div>
</template>

<style scoped>
</style>

