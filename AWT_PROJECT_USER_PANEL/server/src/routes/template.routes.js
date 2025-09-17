const router = require('express').Router();
const ctrl = require('../controllers/template.controller');

router.get('/all', ctrl.all);
router.get('/categories', ctrl.categories);

module.exports = router;


