/*
 * GET users listing.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    
    res.render('game', { title: 'ArtilleryDuel'});
});

export default router;