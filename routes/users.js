const app = require('express');
const { validateAccessToken } = require('../utils/index')
const router = app.Router();
const userController = require('../controllers/users');


router.post('/register',                         userController.createProfile);
router.post('/login',                            userController.login);

router.post('/preferences',                      validateAccessToken,   userController.createPreference)
router.get('/preferences',                       validateAccessToken,   userController.getPreferences)
router.put('/preferences',                       validateAccessToken,   userController.updatePreferences)

router.get('/news',                              validateAccessToken,   userController.getNewsByPreferences)

module.exports = router;
