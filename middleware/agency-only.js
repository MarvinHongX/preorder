export default defineNuxtRouteMiddleware(async () => {
    const { authAgency } = useAgency();
    if (!authAgency?.value || authAgency?.value?.name == '' || authAgency?.value?.phoneCountry == '' || authAgency?.value?.phoneNumber == '') {
        return await navigateTo({ path: '/agency/signin' })
    }
});