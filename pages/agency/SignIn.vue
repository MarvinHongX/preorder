<script setup>
import { ref, computed, watch } from 'vue';

definePageMeta({
    middleware: ['auth']
});

const { signIn } = await useAgency()
const editing = ref(false);
const name = ref('');
const phoneCountry = ref('+82');
const phoneNumber = ref('010');
const password = ref('');
const errors = ref({ signIn: '' });
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

watch([name, phoneCountry, phoneNumber, password], () => {
    errorsSignIn(editing, name, phoneCountry, phoneNumber, password, errors);
});

const handleSignIn = async () => {
    if (!editing.value) editing.value = true;
    errorsSignIn(editing, name, phoneCountry, phoneNumber, password, errors);
    if (errors.value.signIn !== '') return;
    try {
        const data = await signIn({
            name: name.value,
            phoneCountry: phoneCountry.value,
            phoneNumber: phoneNumber.value,
            password: password.value
        });
        
        if (data && data !== '') {
          goToAgencyPage();
          return;
        }
        errors.value.signIn = '이름, 전화번호 또는 비밀번호를 잘못 입력했습니다.';
    } catch (error) {
        console.error(error);
        errors.value.signIn = '이름, 전화번호 또는 비밀번호를 잘못 입력했습니다.';
    }
}
</script>

<template>
  <FormCard title="에이전시 로그인">
    <form @submit.prevent="handleSignIn">
      <div class="mb-12">
        <label for="name" class="mb-2 block text-gray-700 text-[16px]">이름</label>
        <input 
          v-model="name"
          type="text"
          id="name"
          required
          class="border rounded p-2 w-full" />
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
              type="text"
              id="phoneNumber"
              @input="updatePhone"
              maxlength="13"
              placeholder="숫자만 입력해주세요." 
              class="border border-[#DDDDDD] rounded p-2 w-full sm:flex-1 placeholder-[#D7D7D7]"
            />
        </div>
      </div>
      <div class="mb-16">
        <label for="password" class="mb-2 block text-gray-700 text-[16px]">비밀번호</label>
        <input id="password" v-model="password" type="password" class="border rounded p-2 w-full" />
      </div>
      <button 
        type="submit"
        class="bg-[#832BEB] text-white rounded p-3 mb-4 w-full mt-4 hover:bg-[#6B21A8]"
        >
        로그인
      </button>
      <small v-if="errors.signIn" class="text-red-500">{{ errors.signIn }}</small>
    </form>
  </FormCard>
</template>

<style scoped>
/* 여기에 추가적인 스타일링을 적용할 수 있습니다. */
</style>
