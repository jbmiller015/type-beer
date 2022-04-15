const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const collectParam = require('../middlewares/collectParam');
const moment = require("moment");
const createModel = collectParam.createModel;

const generic_controller = require('../controllers/genericController');
const user_controller = require('../controllers/userController')
const process_controller = require("../controllers/processController");
const contents_controller = require("../controllers/contentsController");
const container_controller = require("../controllers/containerController");

const router = express.Router();


//Active: Requires authorization.
router.use(requireAuth);
router.route('/user').get(user_controller.user_get)
router.route('/user/email').put(user_controller.user_email_put)
router.route('/user/password').put(user_controller.user_password_put)
router.route('/:base').get(generic_controller.generic_get).post(generic_controller.generic_post);
router.route('/process/active').get(process_controller.process_active_get)
router.route('/beer/:sub').delete(contents_controller.contents_sub_delete)
router.route('/tank/:sub').delete(container_controller.container_sub_delete)
router.route('/:base/:sub').get(generic_controller.generic_sub_get).post(generic_controller.generic_sub_post).put(generic_controller.generic_sub_put).delete(generic_controller.generic_sub_delete);
router.route('/:base/:sub/:ref').put(generic_controller.generic_sub_ref_put).delete(generic_controller.generic_sub_ref_delete);

module.exports = router;

