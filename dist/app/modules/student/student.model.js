"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.studentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
});
