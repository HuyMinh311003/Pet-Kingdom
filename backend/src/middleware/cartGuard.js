// middleware/cartGuard.js
const { verifyToken } = require('../utils/recaptcha');
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10);
const userCartStats = new Map();

module.exports = async function cartGuard(req, res, next) {
  const userId = req.params.userId;
  const now = Date.now();
  let stat = userCartStats.get(userId);

  if (!stat || now - stat.startAt > WINDOW_MS) {
    stat = { count: 0, startAt: now };
  }
  stat.count++;
  userCartStats.set(userId, stat);

  if (stat.count <= 5) {
    // 5 lần đầu, next() thẳng vào controller
    return next();
  }

  // từ lần 6: require captchaToken
  const token = req.body.captchaToken;
  if (!token) {
    return res
      .status(429)
      .json({ message: 'Captcha required' });
  }

  // verify token
  try {
    const valid = await verifyToken(token);
    if (!valid) {
      return res
        .status(403)
        .json({ message: 'Failed captcha verification' });
    }
    return next();
  } catch (err) {
    console.error('Captcha verify error:', err);
    return res
      .status(500)
      .json({ message: 'Captcha verification error' });
  }
};
