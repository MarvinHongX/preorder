import { allAgencys } from "@/server/services/agency";

export default defineEventHandler(async (event) => {
    const agencyWithPassword = event.context.agency;

    const agencys = await allAgencys(agencyWithPassword);
    return agencys;
});