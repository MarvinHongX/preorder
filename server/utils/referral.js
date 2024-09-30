import crypto from 'crypto';

export const verifyReferralCode = async (name, phoneNumber, referralCode) => {
    try {
        const input = `${name}-${phoneNumber}`;
        const baseReferralCode = hashInput(input)
        
        if (baseReferralCode !== referralCode) {
            return false;
        }
        return true; 
    } catch (error) {
        return false;
        // throw new Error('Error encountered during referral code verification.');
    }
};


export const createReferralCode = async (name, phoneNumber) => {
    try {
        const input = `${name}-${phoneNumber}`;
        const referralCode = hashInput(input)

        return referralCode;
    } catch (error) {
        throw new Error('Error encountered during referral code creation.');
    }
};

const hashInput = (input) => {
    const config = useRuntimeConfig();
    const saltedInput = input + config.salt;
    const hash = crypto.createHash('sha1').update(saltedInput.toString()).digest('hex');
    const result = hash.slice(0, 20);
    return result;
}   