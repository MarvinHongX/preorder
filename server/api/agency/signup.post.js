import { submitAgency } from "@/server/services/agency";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const agency = await submitAgency(body);
    return agency;
});