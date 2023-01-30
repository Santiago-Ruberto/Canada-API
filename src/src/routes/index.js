var router = require('express').Router();
const controller = require('../controllers/index');


router.post('/insert',controller.insertData);
router.get('/get',controller.getData);
router.get('/scrap',controller.scrapData);

module.exports=router;