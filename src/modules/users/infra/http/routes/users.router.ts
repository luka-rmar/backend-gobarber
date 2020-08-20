import { Router } from 'express';
import multer from 'multer';

import UserController from '../controllers/UsersController';
import UpdateUserAvatarController from '../controllers/UserAvatarController';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import uploadConfig from '../../../../../config/upload';

const userController = new UserController();
const updateUserAvatarController = new UpdateUserAvatarController();
const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', userController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  updateUserAvatarController.update,
);

export default usersRouter;
