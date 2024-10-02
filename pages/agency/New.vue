<script setup>
import { ref, computed } from 'vue';
import { newAgency } from '@/commons/commonService';

definePageMeta({
    middleware: ['auth', 'admin-only']
});

const phoneCountries = usePhoneCountries();

const agencyForm = ref({
  verification: '',
  name: '',
  grade: '0',
  phoneCountry: '+82',
  phoneNumber: '010',
  referralCode: '',
  password: '',
  confirmPassword: ''
});

const message = ref('');

const formattedPhone = computed({
  get() {
    return agencyForm.value.phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  },
  set(value) {
    agencyForm.value.phoneNumber = value.replace(/-/g, '');
  }
});

const updatePhone = (event) => {
  formattedPhone.value = event.target.value;
};

const handleSubmit = async () => {
  if (agencyForm.value.password !== agencyForm.value.confirmPassword) {
    message.value = '비밀번호가 일치하지 않습니다.';
    return;
  }

  const response = await newAgency(agencyForm);

  if (response) {
    message.value = '에이전시 등록이 성공적으로 완료되었습니다!';
    goToHomePage();
  } else {
    message.value = '에이전시 등록에 실패했습니다. 다시 시도해주세요.';
  }
};
</script>

<template>
  <FormCard title="에이전시 등록">
    <form @submit.prevent="handleSubmit">
      <div class="mb-12">
        <label for="verification" class="mb-2 block text-gray-700 text-[16px]">인증번호</label>
        <input 
          v-model="agencyForm.verification" 
          type="text" 
          id="verification"
          required 
          class="border rounded p-2 w-full" 
        />
      </div>
      <div class="mb-12">
        <label for="name" class="mb-2 block text-gray-700 text-[16px]">이름</label>
        <input 
          v-model="agencyForm.name" 
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
            v-model="agencyForm.phoneCountry" 
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
            id="phone" 
            @input="updatePhone"
            maxlength="13"
            placeholder="숫자만 입력해주세요."
            class="border rounded p-2 w-full"
          />
        </div>
      </div>
      <div class="mb-4">
        <label for="password" class="mb-2 block text-gray-700 text-[16px]">비밀번호</label>
        <input 
          v-model="agencyForm.password" 
          type="password" 
          id="password" 
          required 
          class="border rounded p-2 w-full" 
        />
      </div>
      <div class="mb-12">
        <label for="confirmPassword" class="mb-2 block text-gray-700 text-[16px]">비밀번호 확인</label>
        <input 
          v-model="agencyForm.confirmPassword" 
          type="password" 
          id="confirmPassword" 
          required 
          class="border rounded p-2 w-full" 
        />
      </div>
      <button 
        type="submit" 
        class="bg-[#832BEB] text-white rounded p-3 mb-4 w-full mt-4 hover:bg-[#6B21A8]"
      >
        등록
      </button>
      <p v-if="message" class="mt-4 text-red-600">{{ message }}</p>
    </form>
  </FormCard>
</template>

<style scoped>
.p-error {
  color: red;
}
</style>
