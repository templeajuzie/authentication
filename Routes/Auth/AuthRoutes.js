const {
    handleErrors,
    userCreate,
    userSignin,
    userRecovery,
    userUpdatePassword,
    isAuthenticated
} = require("../../Controllers/AuthControllers");

const { checkUser } = require("../../Middlewares/AuthMiddleWares");

const router = require("express").Router();

router.route("/").post(checkUser);
router.route("/usercreate").post(userCreate);

router.route("/usersignin").post(userSignin);

router.route("/userrecovery").post(userRecovery);
router.route("/userupdatepassword").post(userUpdatePassword);

module.exports = router;
