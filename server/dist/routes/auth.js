"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
var passport_1 = __importDefault(require("passport"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
/* endpoints */
router.post("/signup/send-otp", authController_1.signupSendOTP);
router.post("/signup/verify-otp", authController_1.verifyOTPAndCreate);
router.post("/login", authController_1.loginWithPassword);
router.get('/me', auth_1.authenticate, function (req, res) {
    var user = __assign({}, req.user);
    var userDetails = { name: user._doc.name, email: user._doc.email, _id: user._doc._id };
    res.status(200).json(userDetails);
});
/* Google auth */
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" }), function (req, res) {
    // successful
    var user = req.user;
    var token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    // redirect to frontend with token
    var frontend = process.env.FRONTEND_URL;
    res.redirect("".concat(frontend, "/auth/google/success?token=").concat(token));
});
router.get("/google/failure", function (req, res) {
    res.status(401).json({ message: "Google auth failed" });
});
exports.default = router;
