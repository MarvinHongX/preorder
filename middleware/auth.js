export default defineNuxtRouteMiddleware(async () => {
  const { authAgency, agencyLoggedIn } = useAgency();
  if (!authAgency.value) {
    await agencyLoggedIn();
  }
});