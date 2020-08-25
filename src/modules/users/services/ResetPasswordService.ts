import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppErros from '@shared/errors/AppErros';
import User from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokensRepository from '../repositories/IUsersTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async run({ token, password }: IRequest): Promise<User> {
    const userToken = await this.usersTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppErros('User token does not exists');
    }

    const addCustomHours = addHours(userToken.created_at, 2);

    if (isAfter(Date.now(), addCustomHours)) {
      throw new AppErros('Token expired');
    }
    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppErros('User does not exists');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);

    return user;
  }
}

export default ResetPasswordService;
