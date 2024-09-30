import { nameAndPhoneOrders } from "@/server/services/order";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const orders = await nameAndPhoneOrders(body);
    return orders;
});