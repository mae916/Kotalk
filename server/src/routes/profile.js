import { Router } from 'express';
import { setStateMsg } from '../controllers/profileController';

const profileRouter = Router();

//상태메시지 변경
profileRouter.post('/setStateMsg', setStateMsg);

export default profileRouter;
