const axios = require('axios');
require('dotenv').config();

async function verifyToken(token) {
    if (!token) return false;
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    // gửi dưới dạng form-urlencoded
    const params = new URLSearchParams({ secret, response: token });
    const { data } = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    // với invisible-v2 chỉ cần check data.success
    return data.success === true;
}

module.exports = { verifyToken };
