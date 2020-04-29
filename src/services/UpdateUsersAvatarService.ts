import { getRepository } from 'typeorm';
import { join } from 'path';
import fs from 'fs';

import AppErros from '../errors/AppErros';
import Users from '../models/Users';
import uploadConfig from '../config/upload';

interface RequestRun {
  user_id: string;
  avatarFilename: string;
}

class UpdateUsersService {
  public async run({ user_id, avatarFilename }: RequestRun): Promise<Users> {
    const usersRepository = getRepository(Users);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppErros('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = join(uploadConfig.directory, avatarFilename);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUsersService;
