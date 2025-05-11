const axios = require('axios');
require('dotenv').config();

module.exports = async function verifyCaptcha(req, res, next) {
  const token = req.body.captchaToken;
  if (!token) {
    return res.status(400).json({ message: 'Missing captcha token' });
  }

  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      { params: { secret, response: token } }
    );
    const data = response.data;
    if (!data.success || data.score < 0.5) {
      // với reCAPTCHA v3, bạn có thể kiểm tra score ≥ 0.5
      return res.status(403).json({ message: 'Failed captcha verification' });
    }
    next();
  } catch (err) {
    console.error('Captcha verify error:', err);
    res.status(500).json({ message: 'Captcha verification error' });
  }
};
