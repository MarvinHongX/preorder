import { referralCodeAgency } from "@/server/services/agency";

export default defineEventHandler(async (event) => {
    const config  = useRuntimeConfig();
    const apiBase = config.public.apiBase;
    const referralCode = event.context.params.referralCode;
    const response = await referralCodeAgency(referralCode);
    return response;
})