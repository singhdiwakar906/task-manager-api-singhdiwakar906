const jwt = require('jsonwebtoken');
const userManager = require('../data/managers/users'); 

module.exports.generateId = (() => {
    let count = 0;
    return () => {
        return count++;
    };
})();

module.exports.validateAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.body.accessToken;

    if (!authHeader) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (Date.now() > decodedData.exp * 1000) {
      return res.status(401).json({ message: 'Token expired' });
    }

    const userData = await userManager.getUserDetails({ email: decodedData.email });

    if (!userData) {
      return res.status(401).json({ message: 'Invalid token user' });
    }

    req.user = userData;
    await next();

  } catch (err) {
    console.error("Error occurred while validating access token:", err.message);
    return res.status(401).json({ message: 'Invalid access token' });
  }
};
