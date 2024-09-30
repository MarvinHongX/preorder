import { referralCodeOrders } from "@/server/services/order";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const orders = await referralCodeOrders(body);
    return orders;
});