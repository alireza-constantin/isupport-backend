const express = require('express');
const router = express.Router({ mergeParams: true });

const { auth } = require('../middleware/auth');
const { getNotes, createNote } = require('../controllers/noteController');

router.route('/').get(auth, getNotes).post(auth, createNote);

module.exports = router;
