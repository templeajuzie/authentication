const {
    userCreate,
    userSignIn,
    userUpdate,
    currentUser,
    userSignOut,
    userDelete
} = require("../../Controllers/AuthControllers");

const { checkUser } = require("../../Middlewares/AuthMiddleWares");

const router = require("express").Router();

router.route("/account").post(userCreate);
router.route("/account/").get(currentUser);
router.route("/account").patch(userUpdate);
router.route("/auth/login").post(userSignIn);
router.route("/account").delete(userDelete);
router.route("/auth/logout").delete(userSignOut);

module.exports = router;
