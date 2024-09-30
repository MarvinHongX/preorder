import { getTokenAgency } from "@/server/services/agency"

export default defineEventHandler(async (event) => {
    const agency = await getTokenAgency(event);
    
    if (agency) {
        event.context.agency = agency;
    } else {
        event.context.agency = null;
    }
});