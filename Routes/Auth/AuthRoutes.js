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
router.route('/account').patch(checkUser, userUpdate);
router.route('/account').delete(checkUser, userDelete);
router.route('/auth/logout').delete(checkUser, userSignOut);

module.exports = router;
