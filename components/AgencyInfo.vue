<script setup>
const props = defineProps({
    authAgency: {
        type: Object,
        default: () => ({}) 
    },
    referralLink: {
        type: String,
        default: '' 
    }
});

const copied = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.referralLink);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};


</script>

<template>
    <div v-if="authAgency" class="mt-8">
        <h2 class="text-[16px] font-medium">사전예약</h2>
        <div class="mt-1 flex flex-row items-center">
            <input 
                type="text"
                :value="referralLink"
                readonly
                class="text-[14px] border px-4 py-2 flex-1 mr-0 sm:mr-2 w-full sm:w-auto"
            />
            <template v-if="!copied">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-[20px] ml-4 mr-4 cursor-pointer"
                    @click="copyToClipboard"
                >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
            </template>
            <template v-else>
                <span  class="text-[14px] line-height-3">&nbsp;Copied!</span>
            </template>
        </div>
    </div>
</template>