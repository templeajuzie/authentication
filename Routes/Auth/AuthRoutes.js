const {
    userCreate,
    userSignin,
    userRecovery,
    userUpdatePassword,
    singleUser,
    isAuthenticated
} = require("../../Controllers/AuthControllers");

const { checkUser } = require("../../Middlewares/AuthMiddleWares");

const router = require("express").Router();

router.route("/").post(isAuthenticated);
router.route("/signup").post(userCreate);

router.route("/signin").post(userSignin);
router.route("/:id").get(singleUser);

router.route("/recovery").post(userRecovery);
router.route("/updatepassword").post(userUpdatePassword);

module.exports = router;
