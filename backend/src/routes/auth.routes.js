import express from 'express';
import controller from '../controller/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/auth/signup', controller.signup);
router.get('/auth/verify', controller.verify);
router.post('/auth/login', controller.login);
router.post('/auth/logout', authMiddleware, controller.logout);
router.get('/me', authMiddleware, controller.me);

export default router;
