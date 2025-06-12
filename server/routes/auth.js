"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Patient_1 = __importDefault(require("../models/Patient"));
const router = (0, express_1.Router)();
// Patient signup
router.post('/patient/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await Patient_1.default.findOne({ email });
        if (existing)
            return res.status(409).json({ message: 'Email already exists' });
        const user = await Patient_1.default.create({ name, email, password });
        res.json({ id: user._id, name: user.name, email: user.email, type: 'patient' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
// Patient login
router.post('/patient/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Patient_1.default.findOne({ email, password });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        res.json({ id: user._id, name: user.name, email: user.email, type: 'patient' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.default = router;
