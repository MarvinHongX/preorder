

const newOrder = async (orderForm) => {
    const newOrderData = {
        name: orderForm.name,
        phone_country: orderForm.phoneCountry,
        phone_number: orderForm.phoneNumber,
        postcode: orderForm.postcode,
        address: orderForm.address,
        detail_address: orderForm.detailAddress,
        order_quantity: orderForm.orderQuantity,
        depositor_name: orderForm.depositorName,
        referral_code: orderForm.referralCode || '', 
        deposit_status: 'N',  
        delivery_status: 'N', 
    };

    try {
        const [rows] = await pool.query(
            `INSERT INTO t_order (name, phone_country, phone_number, postcode, address, detail_address, order_quantity, depositor_name, referral_code, deposit_status, delivery_status, ordDt, regDt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now())`,
            [
                newOrderData.name,
                newOrderData.phone_country,
                newOrderData.phone_number,
                newOrderData.postcode,
                newOrderData.address,
                newOrderData.detail_address,
                newOrderData.order_quantity,
                newOrderData.depositor_name,
                newOrderData.referral_code,
                newOrderData.deposit_status,
                newOrderData.delivery_status,
                newOrderData.ordDt,
                newOrderData.regDt
            ]
        );
        return rows;
    } catch (error) {
        console.error('Error creating new order:', error);
        throw error;
    }
};

const getOrdersByNameAndPhone = async (name, phoneCountry, phoneNumber) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                seq as seq,
                name as name,
                phone_country as phoneCountry,
                phone_number as phoneNumber,
                postcode as postcode,
                address as address,
                detail_address as detailAddress,
                order_quantity as orderQuantity,
                depositor_name as depositorName,
                referral_code as referralCode,
                deposit_status as depositorStatus,
                delivery_status as deliveryStatus,
                DATE_FORMAT(ordDt, '%Y-%m-%d') as ordDt
            FROM t_order WHERE name = ? AND phone_country = ? AND phone_number = ?
            order by ordDt desc, seq desc;
            `,
            [name, phoneCountry, phoneNumber]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching orders by name and phone:', error);
        throw error;
    }
};

const getOrdersByReferralCode = async (referralCode) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                seq as seq,
                name as name,
                phone_country as phoneCountry,
                phone_number as phoneNumber,
                postcode as postcode,
                address as address,
                detail_address as detailAddress,
                order_quantity as orderQuantity,
                depositor_name as depositorName,
                referral_code as referralCode,
                deposit_status as depositorStatus,
                delivery_status as deliveryStatus,
                DATE_FORMAT(ordDt, '%Y-%m-%d') as ordDt
            FROM t_order WHERE referral_code = ?
            order by ordDt desc, seq desc;
            `,
            [referralCode]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching orders by referral code:', error);
        throw error;
    }
};

const getAllOrders = async (referralCode) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                A.seq as seq,
                A.name as name,
                A.phone_country as phoneCountry,
                A.phone_number as phoneNumber,
                A.postcode as postcode,
                A.address as address,
                A.detail_address as detailAddress,
                A.order_quantity as orderQuantity,
                A.depositor_name as depositorName,
                A.referral_code as referralCode,
                B.name as agencyName,
                B.phone_country as agencyPhoneCountry,
                B.phone_number as agencyPhoneNumber,
                A.deposit_status as depositorStatus,
                A.delivery_status as deliveryStatus,
                DATE_FORMAT(A.ordDt, '%Y-%m-%d') as ordDt
            FROM t_order A LEFT JOIN t_agency B ON A.referral_code = B.referral_code
            ${referralCode ? 'WHERE A.referral_code = ?' : ''}
            order by B.name asc, B.phone_number asc, A.ordDt desc, A.seq desc;
            `,
            referralCode ? [referralCode] : []
        );
        return rows;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

export { newOrder, getOrdersByNameAndPhone, getOrdersByReferralCode, getAllOrders }