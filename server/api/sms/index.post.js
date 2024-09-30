import { sendSMS } from "@/server/services/sms";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const result = await sendSMS(body);
    return result;
});

