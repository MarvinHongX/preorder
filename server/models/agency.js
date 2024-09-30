const newAgency = async (agencyForm) => {
    const newAgencyData = {
        name: agencyForm.name,
        grade: '0',
        phone_country: agencyForm.phoneCountry,
        phone_number: agencyForm.phoneNumber,
        password: agencyForm.password,
    };
    const referralCode = await createReferralCode(newAgencyData.name, newAgencyData.phone_number);
    const hashedPassword = await hashPassword(newAgencyData.password);
    
    try {
        const [rows] = await pool.query(
            'INSERT INTO t_agency (name, grade, phone_country, phone_number, referral_code, password) VALUES (?, ?, ?, ?, ?, ?)',
            [newAgencyData.name, newAgencyData.grade, newAgencyData.phone_country, newAgencyData.phone_number, referralCode, hashedPassword]
        );
        return rows;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            // Handle unique constraint violation
            console.error('Duplicate entry error:', error);
            return false;
        } else {
            console.error('Error inserting agency:', error);
            return false;
        }
    }
};


const getAgencyByReferralCode = async (referralCode) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                name as name,
                phone_country as phoneCountry,
                phone_number as phoneNumber,
                referral_code as referralCode
            FROM t_agency WHERE referral_code = ?
            ;
            `,
            [referralCode]
        );
        return rows[0];
    } catch (error) {
        console.error('Error fetching agency by referral code:', error);
        throw error;
    }
};


const getAgecnyByNameAndPhone = async (name, phoneCountry, phoneNumber) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                name as name,
                grade as grade,
                phone_country as phoneCountry,
                phone_number as phoneNumber,
                referral_code as referralCode,
                password as password
            FROM t_agency 
            WHERE name = ? AND phone_country = ? AND phone_number = ?
            ;
            `,
            [name, phoneCountry, phoneNumber]
        );
        return rows[0];
    } catch (error) {
        console.error('Error fetching agency by name and phone:', error);
        throw error;
    }
};

const getAllAgencys = async (referralCode) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                name as name,
                grade as grade,
                phone_country as phoneCountry,
                phone_number as phoneNumber,
                referral_code as referralCode
            FROM t_agency 
            ${referralCode ? 'WHERE A.referral_code = ?' : ''}
            order by name asc, phone_number asc;
            `,
            referralCode ? [referralCode] : []
        );
        return rows;
    } catch (error) {
        console.error('Error fetching all agencys:', error);
        throw error;
    }
};

const updateAgencyPassword = async (name, phoneCountry, phoneNumber, password) => {
    return true;
};


export { newAgency, getAgencyByReferralCode, getAgecnyByNameAndPhone, getAllAgencys, updateAgencyPassword }