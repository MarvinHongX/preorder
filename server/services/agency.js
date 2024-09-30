import { newAgency, getAgencyByReferralCode, getAgecnyByNameAndPhone, updateAgencyPassword, getAllAgencys } from "@/server/models/agency";



const submitAgency = async (body) => {
    const config = useRuntimeConfig();
    if (!body.agencyForm) return false;
    if (body.agencyForm.verification !== config.agencyNewVerification) return false;
    const agency = await newAgency(body.agencyForm);
    if (!agency) {
        return false;
        // throw new Error("new Agency failed");
    }
    
    return agency;
};


const referralCodeAgency = async (givenReferralCode) => {
    if (!givenReferralCode || givenReferralCode == '') return false;
    const agency = await getAgencyByReferralCode(givenReferralCode);
    if (!agency) {
        return false;
        // throw new Error("Agency not found");
    }
    const { name, grade, phoneCountry, phoneNumber, referralCode } = agency;
    return { name, grade, phoneCountry, phoneNumber, referralCode };
};


const signInAgency = async (agency) => {
    const checkAgency = await getAgecnyByNameAndPhone(agency.name, agency.phoneCountry, agency.phoneNumber);

    if (!checkAgency) {
        throw new Error("Agency not found");
    }
    const checkPassword = await verifyPassword(agency.password, checkAgency.password);
    if (!checkPassword) {
        throw new Error("Password is incorrect");
    }

    const { name, grade, phoneCountry, phoneNumber, referralCode } = checkAgency;
    return { name, grade, phoneCountry, phoneNumber, referralCode };
};


const existAgency = async (body) => {
    if (body.referralCode) {
        const checkAgency = await getAgencyByReferralCode(body.referralCode);
        if (checkAgency) {
            return true;
        }
    }
    return false;
};

const updatePassword = async (agency, body) => {
    if (!agency.name || agency.name == '') return null;
    if (!body.currentPassword || body.currentPassword == '') return null;
    if (!body.newPassword || body.newPassword == '') return null;

    const { currentPassword, newPassword } = body;
    const checkUser = await getAgecnyByNameAndPhone(agency.name, agency.phoneCountry, agency.phoneNumber);
    if (!checkUser) {
        throw new Error("Agency not found");
    }
    const checkPassword = await verifyPassword(currentPassword, checkUser.password);
    if (!checkPassword) {
        throw new Error("Password is incorrect");
    }
    const hashedNewPassword = await hashPassword(newPassword);
    const updatedUser = await updateAgencyPassword(name, phoneCountry, phoneNumber, hashedNewPassword);

    if (!updatedUser) {
        return null;
    }
    const { name, grade, phoneCountry, phoneNumber, referralCode } = updatedAgency;
    return { name, grade, phoneCountry, phoneNumber, referralCode };
};

const getTokenAgency = async (event) => {
    const config = useRuntimeConfig();
    const cookie = getCookie(event, config.session);
    if (!cookie) {
        return null;
    }
    const token = await verifyToken(cookie);
    if (!token) {
        return null; 
    }
    const checkAgency = await getAgecnyByNameAndPhone(token.name, token.phoneCountry, token.phoneNumber);
    if (!checkAgency) {
        return null;
    }
    const { name, grade, phoneCountry, phoneNumber, referralCode } = checkAgency;
    return { name, grade, phoneCountry, phoneNumber, referralCode };
};

const allAgencys = async (agencyWithPassword) => {
    if (!agencyWithPassword) return false;
    const { password: _password, ...agencyWithoutPassword } = agencyWithPassword;
    if (!agencyWithoutPassword) return false;
    if (agencyWithoutPassword?.grade !== '9') return false;

    const agencys = await getAllAgencys();
    if (!agencys) {
        return false;
        // throw new Error("agencys not found");
    }
    
    return agencys;
};


export { submitAgency, referralCodeAgency, signInAgency, existAgency, updatePassword, getTokenAgency, allAgencys }