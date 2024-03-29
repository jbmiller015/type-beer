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
const demo_controller = require('../controllers/demoController');

const router = express.Router();


//Active: Requires authorization.
router.use(requireAuth);

//Base routes
router.route('/user').get(user_controller.user_get);
router.route('/:base').get(generic_controller.generic_get)
    .post(generic_controller.generic_post);

//Demo routes
router.route('/demo/:base').get(demo_controller.demo_generic_get);
router.route('/demo/:base/:sub').get(demo_controller.demo_generic_sub_get);
router.route('/demo/:base/:sub/:ref').get(demo_controller.demo_generic_sub_ref_get)

//Sub-base routes or specific base routes
router.route('/user/email').put(user_controller.user_email_put);
router.route('/user/password').put(user_controller.user_password_put);
router.route('/user/admin').post(user_controller.user_admin_post);
router.route('/user/admin').get(user_controller.user_admin_get);
router.route('/process/active').get(process_controller.process_active_get);
router.route('/beer/:sub').delete(contents_controller.contents_sub_delete);
router.route('/tank/:sub').delete(container_controller.container_sub_delete);
router.route('/:base/:sub').get(generic_controller.generic_sub_get)
    .post(generic_controller.generic_sub_post)
    .put(generic_controller.generic_sub_put)
    .delete(generic_controller.generic_sub_delete);

//Specific sub-base routes
router.route('/:base/:sub/:ref').put(generic_controller.generic_sub_ref_put)
    .delete(generic_controller.generic_sub_ref_delete);
router.route('/user/admin/access').get(user_controller.user_admin_access_key_get);
router.route('/user/admin/reset').put(user_controller.user_admin_reset_password_put);

module.exports = router;

