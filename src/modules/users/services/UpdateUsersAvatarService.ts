import { inject, injectable } from 'tsyringe';

import AppErros from '@shared/errors/AppErros';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Users from '../infra/typeorm/entities/Users';
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

    @inject('DiskStorageProvider')
    private diskStorageProdiver: IStorageProvider,
  ) {}

  public async run({ user_id, avatarFilename }: IRequestRun): Promise<Users> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppErros('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      await this.diskStorageProdiver.deleteFile(user.avatar);
    }

    const fileName = await this.diskStorageProdiver.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUsersService;
