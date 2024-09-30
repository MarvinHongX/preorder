import jwt from "jsonwebtoken"

const createToken = async (agency) => {
    const config = useRuntimeConfig();
    return await jwt.sign(
        {
            name: agency.name,
            phoneCountry: agency.phoneCountry,
            phoneNumber: agency.phoneNumber,
        },
        config.tokenSecret,
        {
            expiresIn: config.tokenExpiration
        }
    );
};

const verifyToken = async (token) => {
    try {
        const config = useRuntimeConfig();
        return await jwt.verify(token, config.tokenSecret);
    } catch (err) {
        return null;
    }
};

export { createToken, verifyToken }