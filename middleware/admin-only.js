export default defineNuxtRouteMiddleware(async () => {
    const { agencyAdmin } = useAgency();
    if (!agencyAdmin?.value) {
        return await navigateTo({ path: '/' })
    }
});