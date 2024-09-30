export default defineEventHandler((event) => {
    const agencyWithPassword = event.context.agency;
    if (!agencyWithPassword) {
        return {
            agency: null,
            isAdmin: false
        };
    }
    const { password: _password, ...agencyWithoutPassword } = agencyWithPassword;
    return {
        agency: agencyWithoutPassword,
        isAdmin: (agencyWithoutPassword?.grade ) === '9',
    };
});