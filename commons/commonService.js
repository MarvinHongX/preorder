export const sendSMS = async (
    phoneNumber, 
    token
) => {
    if (phoneNumber && token) {
        try {
            const response = await $fetch(`/api/sms`, {
                method: 'POST',
                body: { 
                    phoneNumber: phoneNumber,
                    token: token,
                }
            });
            return response;  
        } catch (error) {
            console.error('Error send SMS:', error);
            return false;  
        }
    }
    return false; 
};



export const getAgency = async (
    referralCode, 
    loading1,
    agency
) => {
    if (referralCode) {
        $fetch(`/api/agency/${referralCode}`)
            .then((response) => {
                if (!response) {
                    agency.value.existAgency = false
                }
                if (response) {
                    agency.value = {
                        name: response.name,
                        phoneCountry: response.phoneCountry,
                        phoneNumber: response.phoneNumber,
                        referralCode: response.referralCode,
                    };
                    if (loading1.value) loading1.value = false;
                }
            })
            .catch(error => {
                agency.value.existAgency = false
                console.error('Error fetching agency:', error);
            });
    }
};

export const getMenuItems = () => {
    const menuItems = [
        { label: '구매확인', path: '/tracking' },
        { label: '에이전시', path: '/agency' },
    ];
    return menuItems;
};


export const getOrdersByNameAndPhone = (
    name, 
    phoneCountry,
    phoneNumber,
    loading1, 
    orders
) => {
    if (name.value && phoneCountry.value && phoneNumber.value) {
        $fetch(`/api/order/nameAndPhoneOrders`, 
            {
                method: 'POST',
                body: { 
                    name: name.value,
                    phoneCountry: phoneCountry.value,
                    phoneNumber: phoneNumber.value,
                }
            })
            .then((response) => {
                orders.value = response;
                if (loading1.value) loading1.value = false;
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                if (loading1.value) loading1.value = false;
            });
    } else {
        if (loading1.value) loading1.value = false;
    }
};


export const getOrdersByAgency = (
    referralCode, 
    loading1, 
    orders
) => {
    if (referralCode) {
        $fetch(`/api/order/referralCodeOrders`, 
            {
                method: 'POST',
                body: { 
                    referralCode: referralCode,
                }
            })
            .then((response) => {
                orders.value = response;
                if (loading1.value) loading1.value = false;
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                if (loading1.value) loading1.value = false;
            });
    } else {
        if (loading1.value) loading1.value = false;
    }
};

export const getAgencys = (
    loading1, 
    agencys
) => {
    $fetch(`/api/agency/agencys`, 
        {
            method: 'GET',
        })
        .then((response) => {
            agencys.value = response;
            
            if (loading1.value) loading1.value = false;
        })
        .catch(error => {
            console.error('Error fetching agencys:', error);
            if (loading1.value) loading1.value = false;
        });
};

export const getOrders = (
    loading1, 
    orders
) => {
    $fetch(`/api/order/orders`, 
        {
            method: 'GET',
        })
        .then((response) => {
            orders.value = response;
            
            if (loading1.value) loading1.value = false;
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            if (loading1.value) loading1.value = false;
        });
};



export const newOrder = async (orderForm) => {
    if (orderForm.value) {
        try {
            const response = await $fetch(`/api/order`, {
                method: 'POST',
                body: { 
                    orderForm: orderForm.value,
                }
            });
            return response;  
        } catch (error) {
            console.error('Error new order:', error);
            return false;  
        }
    }
    return false; 
};


export const newAgency = async (agencyForm) => {
    if (agencyForm.value) {
        try {
            const response = await $fetch(`/api/agency/signup`, {
                method: 'POST',
                body: { 
                    agencyForm: agencyForm.value,
                }
            });
            return response;  
        } catch (error) {
            console.error('Error new agency:', error);
            return false;  
        }
    }
    return false; 
};