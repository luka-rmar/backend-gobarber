import { join } from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import AppErros from '@shared/errors/AppErros';
import Users from '../infra/typeorm/entities/Users';
import uploadConfig from '../../../config/upload';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestRun {
  user_id: string;
  avatarFilename: string;
}
@injectable()
class UpdateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async run({ user_id, avatarFilename }: IRequestRun): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);

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

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUsersService;
