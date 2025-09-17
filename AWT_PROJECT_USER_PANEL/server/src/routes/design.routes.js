const router = require('express').Router();
const ctrl = require('../controllers/design.controller');
const { auth } = require('../middlewares/auth.middleware');

router.use(auth);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;


