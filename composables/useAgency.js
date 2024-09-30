export const useAgency = () => {
    const authAgency = useState('authAgency', () => null);
    const agencyAdmin = useState('agencyAdmin', () => false);

    const setAgency = (agency) => {
        authAgency.value = agency;
    };


    const signIn = async (agency) => {
        try {
            const data = await $fetch('/api/agency', {
                method: 'POST',
                body: agency
            });
            if (data.isAdmin) {
                agencyAdmin.value = true;
            } else {
                agencyAdmin.value = false;
            }
            setAgency(data.agency);
            return data;
        } catch (err) {
            return null;
        }
    };

    const agencyLoggedIn = async () => {
        if (!authAgency.value) {
            const data = await $fetch('/api/agency/token', {
                headers: useRequestHeaders(['cookie'])
            });
            if (data.isAdmin) {
                agencyAdmin.value = true;
            } else {
                agencyAdmin.value = false;
            }
            setAgency(data.agency);
            return data;
        }
    };

    const signOut = async () => {
        try {
            const data = await $fetch('/api/agency/signout');
            if (data.signOut) {
                agencyAdmin.value = false;
                setAgency(null);
                return true;
            }
            return false;
        } catch (err) {
            return false;
        };
    };

    const updatePassword = async (currentPassword, newPassword) => {
        try {
            const data = await $fetch('/api/agency/updatepassword', {
                method: 'POST',
                body: {
                    currentPassword,
                    newPassword
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return data;
        } catch (err) {
            return null;
        }
    };


    const existAgency = async (referralCode) => {
        try {
            const data = await $fetch('/api/agency/exist', {
                method: 'POST',
                body: referralCode,
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            return data.exist || false;
        } catch (err) {
            return false;
        }
    };
    

    return {
        signIn,
        agencyLoggedIn,
        agencyAdmin,
        signOut,
        authAgency,

        updatePassword,
        existAgency
    };
};