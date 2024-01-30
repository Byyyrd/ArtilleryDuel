"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET users listing.
 */
const express = require("express");
const path = require("path");
const router = express.Router();
router.get('/', (req, res) => {
    res.sendFile('client.html', { root: path.resolve(__dirname, '../views') });
});
exports.default = router;
//# sourceMappingURL=user.js.map