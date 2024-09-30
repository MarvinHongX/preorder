import { allOrders } from "@/server/services/order";

export default defineEventHandler(async (event) => {
    const agencyWithPassword = event.context.agency;

    const orders = await allOrders(agencyWithPassword);
    return orders;
});