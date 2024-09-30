import { signInAgency } from "@/server/services/agency";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const agency = await signInAgency(body);
    const token = await createToken(agency);
    const isAdmin = (agency.grade == '9');

    const config = useRuntimeConfig();
    setCookie(event, config.session, token);
    
    return {
        agency,
        token,
        isAdmin
    };
});