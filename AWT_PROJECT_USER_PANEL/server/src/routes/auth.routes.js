const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
router.get('/me', auth, ctrl.me);
router.put('/me', auth, ctrl.updateMe);
router.post('/change-password', auth, ctrl.changePassword);

module.exports = router;


