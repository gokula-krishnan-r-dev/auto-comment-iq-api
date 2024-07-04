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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dev_1 = require("../config/dev");
const user_model_1 = __importDefault(require("../models/user.model"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Get token from Authorization header
    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }
    jsonwebtoken_1.default.verify(token, dev_1.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Failed to authenticate token" });
        }
        req.user = decoded; // Set the decoded user information on the request object
        next();
    });
};
exports.verifyToken = verifyToken;
const authenticateToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(token);
        // Replace this with your actual asynchronous authentication logic
        const user = yield user_model_1.default.findOne({ token: token });
        if (!user) {
            // console.error("User not found");
            return null;
        }
        // Assuming 'token' is a property on the user object
        const storedToken = user.token;
        if (token === storedToken) {
            return user;
        }
        return null;
    }
    catch (error) {
        console.error("Error during authentication:", error);
        return null;
    }
});
const authenticateUser = (req, res, next) => {
    const authToken = req.header("Authorization");
    console.log(req.path);
    const user = authenticateToken(authToken);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // Attach user information to the request for later use
    req.user = user;
    next();
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=verifyToken.js.map