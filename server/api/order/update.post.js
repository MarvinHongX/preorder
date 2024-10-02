import { editOrder } from "@/server/services/order";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const response = await editOrder(body);
    return response;
});