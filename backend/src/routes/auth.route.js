import { Router } from 'express';
import { login, logout, register , checkAuth } from '../controller/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';


const authRouter = Router();  

authRouter.post('/register' , register);
authRouter.post('/login' , login);
authRouter.post('/logout' , logout);
authRouter.get('/checkAuth', verifyToken  ,checkAuth);

export default authRouter;