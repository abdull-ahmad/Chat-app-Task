import express from 'express';
import authRouter from './auth.route.js';
import chatRouter from './chat.route.js';


const router= express.Router();

router.use('/auth', authRouter);
router.use('/chat', chatRouter);

export default router;