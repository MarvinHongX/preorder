<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { sendSMS, getAgency, newOrder } from '@/commons/commonService';

const loading1 = ref(true);
const route = useRoute();
const agency = ref({     
    existAgency: true,
    name: '',
    phoneCountry: '',
    phoneNumber: '',
    referralCode: '',  
});

const orderForm = ref({
    editing: false,
    name: '',
    phoneCountry: '+82',
    phoneNumber: '010',
    postcode: '',
    address: '',
    detailAddress: '',
    orderQuantity: 1,
    depositorName: '',
    referralCode: ''
});



const smsCode = ref(''); // 인증번호
const timer = ref(60); // 1분 타이머
const isCodeValid = ref(false); // 인증번호 유효성
const countdownInterval = ref(null); // 카운트다운 인터벌
const isCodeVerified = ref(false); // 인증번호 확인 상태
const isAgreementChecked = ref(false); // 약관 동의 상태



const errors = ref({
    order: '',
    name: '',
    phone: '',
    postcode: '',
    address: '',
    detailAddress: '',
    depositorName: '',
});

watch(orderForm, () => {
  if (!orderForm.value.editing) orderForm.value.editing = true;

  errorsName(orderForm.value.editing, orderForm.value.name, errors);
  errorsPhone(orderForm.value.editing, orderForm.value.phoneCountry, orderForm.value.phoneNumber, errors);
  errorsPostcode(orderForm.value.editing, orderForm.value.postcode, errors);
  errorsAddress(orderForm.value.editing, orderForm.value.address, errors);
  errorsDetailAddress(orderForm.value.editing, orderForm.value.detailAddress, errors);
  errorsOrderQuantity(orderForm.value.editing, orderForm.value.orderQuantity, errors);
  errorsDepositorName(orderForm.value.editing, orderForm.value.depositorName, errors);
  
}, { deep: true });



const formattedPhone = computed({
  get() {
    return orderForm.value.phoneNumber.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  },
  set(value) {
    orderForm.value.phoneNumber = value.replace(/-/g, '');
  }
});

const startCountdown = () => {
  timer.value = 60; // 1분 타이머 설정
  isCodeValid.value = true; // 인증번호 유효성 설정

  countdownInterval.value = setInterval(() => {
    timer.value -= 1;
    if (timer.value <= 0) {
      clearInterval(countdownInterval.value);
      isCodeValid.value = false; // 1분 후 인증번호 만료
    }
  }, 1000);
};

const onClickSendSMS = () => {
  errorsPhone(orderForm.value.editing, orderForm.value.phone, errors);
  
  if (errors.value.phone !== '') return

  clearInterval(countdownInterval.value);
  const unformattedNumber = orderForm.value.phoneNumber.replace(/[^0-9]/g, '');
  smsCode.value = generateRandomCode(); 
  sendSMS(unformattedNumber, smsCode.value);

  startCountdown();
};

const verifyCode = () => {
  const inputCode = document.getElementById('verificationCode').value;
  if (inputCode === smsCode.value) {
    isCodeVerified.value = true; // 인증번호 확인됨
    isCodeValid.value = false; // 인증번호 유효성 종료
  } else {
    alert('인증번호가 올바르지 않습니다.');
  }
};

const updatePhone = (event) => {
  formattedPhone.value = event.target.value;
};

const increaseQuantity = () => {
  orderForm.value.orderQuantity += 1;
};

const decreaseQuantity = () => {
  if (orderForm.value.orderQuantity > 1) {
    orderForm.value.orderQuantity -= 1;
  }
};



const loadDaumPostcodeScript = () => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('daum-postcode-script')) {
        resolve();
        return;
    }
    const script = document.createElement('script');
    script.id = 'daum-postcode-script';
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const onClickDaumPostcode = () => {
  new daum.Postcode({
    oncomplete: function(data) {
      let addr = '';
      let extraAddr = '';

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if (extraAddr !== '') {
          extraAddr = ` (${extraAddr})`;
        }
      }

      orderForm.value.postcode = data.zonecode;
      orderForm.value.address = addr;
      orderForm.value.extraAddress = extraAddr;

      document.getElementById('detailAddress').focus();

      document.getElementById('wrap').style.display = 'none';
    },

    onresize: function(size) {
      document.getElementById('wrap').style.height = size.height + 'px';
    },
    width: '100%',
    height: '100%'
  }).embed(document.getElementById('wrap'));

  document.getElementById('wrap').style.display = 'block';
};


const foldDaumPostcode = () => {
  document.getElementById('wrap').style.display = 'none';
};



onMounted(async () => {
  orderForm.value.referralCode = route.params.referralCode.toString();
  await getAgency(orderForm.value.referralCode, loading1, agency);
  if (agency.value.existAgency == false) {
    goToNotFoundPage();
  }
  try {
    await loadDaumPostcodeScript();
  } catch (error) {
    console.error('Failed to load Daum Postcode script:', error);
  }
});

watch(() => agency.value.existAgency, (newValue) => {
  if (newValue == false) {
    console.log(newValue);
    goToNotFoundPage();
  }
});

watch(() => route.params.referralCode, async (newValue, oldValue) => {
  if (newValue !== oldValue) {
    orderForm.value.referralCode = newValue.toString();
    await getAgency(orderForm.value.referralCode, loading1, agency);
  
    if (agency.value.existAgency == false) {
      goToNotFoundPage();
    }
  }
});


const handleOrder = async () => {
  if (!orderForm.value.editing) orderForm.value.editing = true;

  errorsName(orderForm.value.editing, orderForm.value.name, errors);
  errorsPhone(orderForm.value.editing, orderForm.value.phone, errors);
  errorsPostcode(orderForm.value.editing, orderForm.value.postcode, errors);
  errorsAddress(orderForm.value.editing, orderForm.value.address, errors);
  errorsDetailAddress(orderForm.value.editing, orderForm.value.detailAddress, errors);
  errorsOrderQuantity(orderForm.value.editing, orderForm.value.orderQuantity, errors);
  errorsDepositorName(orderForm.value.editing, orderForm.value.depositorName, errors);
  
  if (errors.value.name !== '') return
  if (errors.value.phone !== '') return
  if (errors.value.postcode !== '') return
  if (errors.value.address !== '') return
  if (errors.value.detailAddress !== '') return
  if (errors.value.orderQuantity !== '') return
  if (errors.value.depositorName !== '') return

  try {
    const data = await newOrder(orderForm);
    if (data) {
      alert('예약이 성공적으로 완료되었습니다!');
      goToTrackingPage();
      return;
    } else {
      errors.value.order = '사전예약에 실패했습니다. 다시 시도해주세요.';
    }
  } catch (error) {
    console.error(error);
    errors.value.order = '사전예약에 실패했습니다. 다시 시도해주세요.';
    return;
  }
}
</script>

<template>
  <div 
    v-if="!loading1" 
    class="max-w-lg mx-auto" 
  >
    <div class="bg-white pt-8 pb-8 mb-4 border-b border-[#EBEBEB]">
      <div class="text-[28px] font-medium mb-4">ROAM XR7 사전예약 할인판매</div>
      <div class="text-[18px] font-normal">
        에이전시: {{ agency.name }} {{ formatPhoneNumber(agency.phoneNumber) }}
      </div>
    </div>
    <RoamInfo />
    <!-- <div v-if="isInfoOpen" class="bg-white p-4 mb-4">
      <h2 class="text-xl font-semibold mb-2">상품 소개</h2>
      <p>ROAM XR7은 최신 기술이 집약된 혁신적인 제품입니다. 탁월한 성능과 디자인으로, 사용자에게 최고의 경험을 제공합니다.</p>
    </div>
    <button @click="toggleInfo" class="border border-[#707070] p-4 mb-8 w-full flex items-center justify-center hover:bg-gray-200">
      <span class="text-[#707070] mr-2">
        {{ isInfoOpen ? '상품정보 접기' : '상품정보 펼치기' }}
      </span>
      <img 
          :src="isInfoOpen ? foldUrl : expandUrl"
          alt="Toggle Details"
          class="w-[12px] h-[6px]"
        />
    </button> -->

    <form 
      @submit.prevent="handleOrder"
      class="bg-[#F9F9F9] px-4 pt-8 pb-8 mb-4">
      <div class="text-center text-[18px] font-medium mb-16">주문 / 결제</div>                   
      <div class="mb-12">
          <label for="name" class="mb-2 block text-gray-700 text-[16px]">이름</label>
          <input 
            v-model="orderForm.name" 
            required
            type="text"
            id="name"
            class="border border-[#DDDDDD] rounded p-2 w-full placeholder-[#D7D7D7]" /> 
            <div>
                <small id="name-error" class="p-error mb-5" v-if="errors.name !== ''">{{ errors.name }}</small>
            </div>
        </div>
        <div class="mb-12">
          <label for="phone" class="mb-2 block text-gray-700 text-[16px]">휴대전화</label>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input 
              v-model="formattedPhone"
              required
              type="text" 
              id="phoneNumber" 
              @input="updatePhone"
              :disabled="isCodeVerified" 
              maxlength="13"
              placeholder="숫자만 입력해주세요."
              class="border border-[#DDDDDD] rounded p-2 w-full sm:flex-1 placeholder-[#D7D7D7]"
            />
            <input 
              type="button" 
              @click="onClickSendSMS"
              :disabled="isCodeVerified"
              v-if="!isCodeVerified"
              value="인증번호 받기"
              class="border border-[#BDBDBD] bg-white text-[14px] text-[#707070] rounded p-2 w-full sm:w-auto sm:flex-none hover:bg-gray-200"
            >
          </div>
          <div v-if="isCodeValid" class="text-green-600 mt-2">
              인증번호를 입력하세요. ({{ timer }}초 남음)
          </div>
          <div v-if="isCodeValid && !isCodeVerified" class="mt-2">
            <input type="text" id="verificationCode" placeholder="인증번호 입력" class="border border-[#DDDDDD] rounded p-2 w-full placeholder-[#D7D7D7]" /> 
              <button type="button" @click="verifyCode" class="bg-green-500 text-white rounded px-4 ml-2">확인</button>
          </div>
          <div>
            <small id="phone-error" class="p-error mb-5" v-if="errors.phone !== ''">{{ errors.phone }}</small>
          </div>
        </div>
        <div class="mb-12">
          <label for="address" class="mb-2 block text-gray-700 text-[16px]">배송 주소</label>
          <div class="flex gap-2">
            <input 
              v-model="orderForm.postcode"
              required
              type="text" 
              id="postcode" 
              placeholder="우편번호" 
              class="border border-[#DDDDDD] rounded p-2 w-full placeholder-[#D7D7D7]"
            />
            <input 
              type="button" 
              @click="onClickDaumPostcode" 
              value="우편번호 찾기" 
              class="border border-[#BDBDBD] bg-white text-[14px] text-[#707070] rounded px-2 hover:bg-gray-200"
            />
          </div>
          <div>
            <small id="postcode-error" class="p-error mb-5" v-if="errors.postcode !== ''">{{ errors.postcode }}</small>
          </div>
          <div
            id="wrap"
            style="
              display: none;
              border: 1px solid;
              width: 100%;
              min-width: 300px;
              height: 300px;
              margin: 5px 0;
              position: relative;
              box-sizing: border-box;
            "
          >
            <img
              src="//t1.daumcdn.net/postcode/resource/images/close.png"
              id="btnFoldWrap"
              style="cursor: pointer; position: absolute; right: 0px; top: -1px; z-index: 1"
              @click="foldDaumPostcode"
              alt="접기 버튼"
            />
          </div>
          <input 
            v-model="orderForm.address"
            required
            type="text"
            id="address"
            placeholder="주소"
            class="border border-[#DDDDDD] rounded p-2 w-full mt-2 placeholder-[#D7D7D7]" />
          <div>
            <small id="address-error" class="p-error mb-5" v-if="errors.address !== ''">{{ errors.address }}</small>
          </div>
          <input
            v-model="orderForm.detailAddress" 
            required
            type="text"
            id="detailAddress"
            placeholder="상세주소"
            class="border border-[#DDDDDD] rounded p-2 w-full mt-2 placeholder-[#D7D7D7]" />
          <div>
            <small id="detailAddress-error" class="p-error mb-5" v-if="errors.detailAddress !== ''">{{ errors.detailAddress }}</small>
          </div>
        </div>

        <div class="mb-12">
          <label for="orderQuantity" class="mb-2 block text-gray-700">주문 수량</label>
          <div class="flex items-center w-full">
            <button 
              type="button" 
              @click="decreaseQuantity" 
              class="bg-transparent w-10 h-10 flex items-center justify-center border border-gray-400 hover:bg-gray-200">-</button>
            <input 
              v-model.number="orderForm.orderQuantity"
              required
              type="number" 
              min="1" 
              id="orderQuantity" 
              class="border border-[#DDDDDD] rounded p-2 text-right mx-1 w-full" />
            <button 
              type="button" 
              @click="increaseQuantity" 
              class="bg-transparent w-10 h-10 flex items-center justify-center border border-gray-400 hover:bg-gray-200">+</button>
          </div>
          <div>
            <small id="orderQuantity-error" class="p-error mb-5" v-if="errors.orderQuantity !== ''">{{ errors.orderQuantity }}</small>
          </div>
        </div>
        <div class="mb-12">
          <label for="depositorName" class="mb-2 block text-gray-700">입금자명</label>
          <input 
            v-model="orderForm.depositorName"
            required
            type="text"
            id="depositorName" 
            class="border border-[#DDDDDD] rounded p-2 w-full placeholder-[#D7D7D7]" /> 
            <div>
              <small id="depositorName-error" class="p-error mb-5" v-if="errors.depositorName !== ''">{{ errors.depositorName }}</small>
            </div>
        </div>

        <div class="mb-2">
          <TermsOfUse />
        </div>

        <div class="mb-20 flex items-center">
          <input 
            v-model="isAgreementChecked"  
            required
            type="checkbox"
            id="agreement"
            class="custom-checkbox"
          />
          <label for="agreement" class="text-gray-700">
            &nbsp;<span class="text-[#CA4545]">(필수)</span>
            위의 약관에 동의합니다.
          </label>
        </div>
        <button 
          type="submit"
          :disabled="!isCodeVerified"
          class="bg-[#832BEB] text-white rounded p-4 mb-4 w-full mt-4 hover:bg-[#6B21A8]"
        >
          주문하기
        </button>
        <div>
          <small id="order-error" class="p-error mb-5" v-if="errors.order !== ''">{{ errors.order }}</small>
        </div>
    </form>      
  </div>
  <div v-else class="text-gray-500">loading...</div>
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
