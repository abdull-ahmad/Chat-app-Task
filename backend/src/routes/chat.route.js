import { Router } from 'express';
import { getMessages, getUsersForSidebar, sendMessage }from '../controller/chat.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const chatRouter = Router();  

chatRouter.get("/users", verifyToken, getUsersForSidebar);
chatRouter.get("/:id", verifyToken, getMessages);

chatRouter.post("/send/:id", verifyToken, sendMessage);

export default chatRouter;