"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithPassword = exports.verifyOTPAndCreate = exports.signupSendOTP = void 0;
var User_1 = __importDefault(require("../models/User"));
var mailer_1 = require("../utils/mailer");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
/* helper function */
function signJWT(userId) {
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
}
var signupSendOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name, otp, otpExpiry, user, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, name = _a.name;
                if (!email)
                    return [2 /*return*/, res.status(400).json({ message: "Email required" })];
                otp = Math.floor(100000 + Math.random() * 900000).toString();
                otpExpiry = new Date(Date.now() + (Number(process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000));
                return [4 /*yield*/, User_1.default.findOneAndUpdate({ email: email }, {
                        email: email,
                        name: name,
                        otp: otp,
                        otpExpiresAt: otpExpiry
                    }, { upsert: true, new: true, setDefaultsOnInsert: true })];
            case 1:
                user = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, mailer_1.sendOTPEmail)(email, otp)];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.error("mailer error", err_1);
                return [2 /*return*/, res.status(500).json({ message: "Failed to send OTP" })];
            case 5: return [2 /*return*/, res.json({ message: "OTP sent" })];
        }
    });
}); };
exports.signupSendOTP = signupSendOTP;
var verifyOTPAndCreate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, password, user, hash, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, otp = _a.otp, password = _a.password;
                if (!email || !otp)
                    return [2 /*return*/, res.status(400).json({ message: "Email and OTP required" })];
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user || !user.otp || !user.otpExpiresAt)
                    return [2 /*return*/, res.status(400).json({ message: "No OTP found. Please request again." })];
                if (user.otp !== otp)
                    return [2 /*return*/, res.status(400).json({ message: "Invalid OTP" })];
                if (user.otpExpiresAt < new Date())
                    return [2 /*return*/, res.status(400).json({ message: "OTP expired" })];
                if (!password) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hash = _b.sent();
                user.password = hash;
                _b.label = 3;
            case 3:
                user.isVerified = true;
                user.otp = null;
                user.otpExpiresAt = null;
                return [4 /*yield*/, user.save()];
            case 4:
                _b.sent();
                token = signJWT(user._id.toString());
                return [2 /*return*/, res.json({ token: token, user: { email: user.email, name: user.name } })];
        }
    });
}); };
exports.verifyOTPAndCreate = verifyOTPAndCreate;
var loginWithPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, ok, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password)
                    return [2 /*return*/, res.status(400).json({ message: "Email and password required" })];
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user || !user.password)
                    return [2 /*return*/, res.status(400).json({ message: "User not found or no password set" })];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                ok = _b.sent();
                if (!ok)
                    return [2 /*return*/, res.status(401).json({ message: "Invalid credentials" })];
                token = signJWT(user._id.toString());
                return [2 /*return*/, res.json({ token: token, user: { email: user.email, name: user.name } })];
        }
    });
}); };
exports.loginWithPassword = loginWithPassword;
