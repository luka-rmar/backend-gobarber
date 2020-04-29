import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreateUsersService from '../services/CreateUsersService';
import UpdateUsersAvatarService from '../services/UpdateUsersAvatarService';
import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = new CreateUsersService();

  const user = await createUser.run({ name, email, password });

  delete user.password;

  return res.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const updateAvatar = new UpdateUsersAvatarService();

    const user = await updateAvatar.run({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });
    delete user.password;

    return res.json(user);
  },
);

export default usersRouter;
