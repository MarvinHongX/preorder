import { existAgency } from "@/server/services/agency";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const exist = await existAgency(body);
    return {
        exist
    };
});