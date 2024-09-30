import bcrypt from 'bcryptjs'

export const verifyPassword = async (password, hash) => {
    const compare = await bcrypt.compare(password, hash);
    if (!compare) {
        throw new Error('Password does not match.');
    }
    return compare;
};


export const hashPassword = async (password) => {
    try {
        const config = useRuntimeConfig();
        const saltRounds = parseInt(config.saltRounds, 10);
        if (isNaN(saltRounds)) {
            throw new Error('Invalid saltRounds value');
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error encountered during password hashing.');
    }
};