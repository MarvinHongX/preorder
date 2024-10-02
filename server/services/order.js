import { newOrder, getOrdersByNameAndPhone, getOrdersByReferralCode, getAllOrders, updateOrder } from "@/server/models/order";


const nameAndPhoneOrders = async (body) => {
    if (!body.name || !body.phoneCountry || !body.phoneNumber) return false;
    const orders = await getOrdersByNameAndPhone(body.name, body.phoneCountry, body.phoneNumber);
    if (!orders) {
        return false;
        // throw new Error("orders not found");
    }
    
    return orders;
};

const referralCodeOrders = async (body) => {
    if (!body.referralCode) return false;
    const orders = await getOrdersByReferralCode(body.referralCode);
    if (!orders) {
        return false;
        // throw new Error("orders not found");
    }
    
    return orders;
};

const allOrders = async (agencyWithPassword) => {
    if (!agencyWithPassword) return false;
    const { password: _password, ...agencyWithoutPassword } = agencyWithPassword;
    if (!agencyWithoutPassword) return false;
    if (agencyWithoutPassword?.grade !== '9') return false;

    const orders = await getAllOrders();
    if (!orders) {
        return false;
        // throw new Error("orders not found");
    }
    
    return orders;
};


const submitOrder = async (body) => {
    if (!body.orderForm) return null;
    const order = await newOrder(body.orderForm);
    if (!order) {
        throw new Error("new order failed");
    }
    
    return order;
};

const editOrder = async (body) => {
    if (!body.orderForm) return null;
    const ok = await updateOrder(body.orderForm);
    if (!ok) {
        throw new Error("update order failed");
    }
    
    return ok;
};




export { nameAndPhoneOrders, referralCodeOrders, allOrders, submitOrder, editOrder }