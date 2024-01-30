"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET users listing.
 */
const express = require("express");
const router = express.Router();
router.get('/', (req, res) => {
    res.render('game', { title: 'ArtilleryDuel' });
});
exports.default = router;
//# sourceMappingURL=game.js.map