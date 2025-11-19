POST /admin/create-doctor

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const roles = require('../middleware/ro