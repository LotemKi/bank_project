import express from 'express';
import controller from '../controller/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', controller.signup);
router.get('/verify', controller.verify);
router.post('/login', controller.login);
router.post('/logout', authMiddleware, controller.logout);
router.get('/me', authMiddleware, controller.me);

export default router;
