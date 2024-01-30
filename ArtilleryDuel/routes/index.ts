/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

export default router;