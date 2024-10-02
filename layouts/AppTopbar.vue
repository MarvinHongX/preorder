<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
const menuItems = useMenuItems();
const { logoUrl, adminUrl, agencyUrl, newAgencyUrl } = useImg();
const { authAgency, signOut, agencyAdmin } = await useAgency();
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);



onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const onSignOutClick = async () => {
    topbarMenuActive.value = false;
    const ok = await signOut();
    if (ok) {
        goToTrackingPage();  
    }
};

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};


const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};

const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
};

const isOutsideClicked = (event) => {
    const dropdownMenuEl = document.querySelector('.dropdown-width');
    const topbarButtonEl = document.querySelector('.layout-topbar-menu-button');

    return !(dropdownMenuEl?.contains(event.target) || topbarButtonEl?.contains(event.target));
};
</script>

<template>
    <header class="bg-white text-gray py-6 fixed top-0 left-0 w-full z-50 layout-topbar">
        <div class="max-w-7xl mx-auto flex justify-between items-center px-4">
            <!-- <router-link to="/" class="layout-topbar-logo">
                <img :src="logoUrl" alt="logo" />
            </router-link> -->
            <div class="layout-topbar-logo">
                <img :src="logoUrl" alt="logo" />
            </div>
            <div class="flex items-center">
                <span class="text-xl font-bold"></span>
            </div>
            <nav class="items-center">
                <ul class="flex space-x-6">
                    <li v-for="item in menuItems" :key="item.path">
                        <NuxtLink 
                            :to="item.path" 
                            class="hover:text-gray-300 transition-colors duration-200"
                        >
                            {{ item.label }}
                        </NuxtLink>
                    </li>
                    <template v-if="authAgency">
                        <li v-if="authAgency">
                            <div class="relative">
                                <button class="border-l-2 border-gray-300 pl-5 layout-topbar-menu-button hover:text-gray-300 transition-colors duration-200" @click="onTopBarMenuButton()">
                                    <i class="pi pi-user"></i>
                                    <span class="">{{ authAgency?.name }}님</span>
                                </button>
                                <div v-if="topbarMenuActive" class="absolute right-0 bg-[#F9F9F9] text-black rounded shadow-lg mt-2 p-4 dropdown-width">
                                    <div class="font-bold text-lg mb-2 text-center">{{ authAgency?.name }}님 환영합니다!</div>     
                                    <div class="flex flex-col justify-center pt-4 text-[14px]">
                                        <button
                                            v-if="authAgency"
                                            @click="goToAgencyPage"
                                            class="flex text-left px-0 py-2 rounded"
                                        >
                                            <img :src="agencyUrl" alt="에이전시" class="w-6 h-6 mr-2" />
                                            에이전시
                                        </button>
                                        <button
                                            v-if="agencyAdmin"
                                            @click="goToAgencyAdminPage"
                                            class="flex text-left px-0 py-2 rounded"
                                        >
                                            <img :src="adminUrl" alt="에이전시" class="w-6 h-6 mr-2" />
                                            관리자 페이지
                                        </button>
                                        <button
                                            v-if="agencyAdmin"
                                            @click="goToAgencyNewPage"
                                            class="flex text-left px-0 py-2 rounded"
                                        >
                                            <img :src="newAgencyUrl" alt="에이전시" class="w-6 h-6 mr-2" />
                                            에이전시 등록
                                        </button>
                                    </div>
                                    <hr class="my-6 border-t border-gray-300"/>
                                    <div class="flex justify-center">
                                        <button @click="onSignOutClick" 
                                            class="bg-[#832BEB] text-white rounded px-4 py-2  hover:bg-[#6B21A8]"
                                        >
                                            로그아웃
                                        </button>
                                        
                                    </div>
                                </div>
                            </div>
                        </li>
                    </template>
                    <template v-else>
                        <li>
                            <NuxtLink 
                                to="/agency" 
                                class="hover:text-gray-300 transition-colors duration-200"
                            >
                                에이전시
                            </NuxtLink>
                        </li>
                    </template>
                    
                    
                </ul>
            </nav>
        </div>
    </header>

    <div class="mt-16">
        <slot />  <!-- for page content -->
    </div>
</template>

<style scoped>
.layout-topbar {
  height: 81px;
  border-bottom: 1px solid #707070;
}

.dropdown-width {
    width: 200px;
    min-width: 200px;
    padding: 1rem;
}

.layout-topbar-menu-mobile-active {
    display: block;
}
</style>
