export default defineEventHandler((event) => {
    const config = useRuntimeConfig();
    deleteCookie(event, config.session);
    return {
        signOut: true
    };
});