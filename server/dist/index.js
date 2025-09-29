"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var app_1 = __importDefault(require("./app"));
var port = process.env.PORT || 5000;
app_1.default.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
