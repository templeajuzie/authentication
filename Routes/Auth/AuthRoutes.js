const {
  userCreate,
  userSignIn,
  userUpdate,
  currentUser,
  userSignOut,
  userDelete,
} = require('../../Controllers/AuthControllers');

const checkUser = require('../../Middlewares/AuthMiddlewares');

const router = require('express').Router();

router.route('/account').post(userCreate);
router.route('/auth/login').post(userSignIn);
router.route('/account/').get(checkUser, currentUser);
router.route('/account').patch(userUpdate);
router.route('/account').delete(userDelete);
router.route('/auth/logout').delete(userSignOut);

module.exports = router;
