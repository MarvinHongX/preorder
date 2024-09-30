import { submitOrder } from "@/server/services/order";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const order = await submitOrder(body);
    return order;
});