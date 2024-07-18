"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.hassPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hassPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    return await bcrypt_1.default.hash(password, salt);
};
exports.hassPassword = hassPassword;
const checkPassword = async (enteregPassword, storeHash) => {
    return await bcrypt_1.default.compare(enteregPassword, storeHash);
};
exports.checkPassword = checkPassword;
//# sourceMappingURL=auth.js.map