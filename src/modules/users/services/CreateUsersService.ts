import { injectable, inject } from 'tsyringe';

import AppErros from '@shared/errors/AppErros';
import Users from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestRun {
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async run({ name, email, password }: IRequestRun): Promise<Users> {
    const verifyEmailExists = await this.usersRepository.findByEmail(email);

    if (verifyEmailExists) {
      throw new AppErros('Email address already used');
    }

    const passwordHashed = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHashed,
    });

    return user;
  }
}

export default CreateUsersService;
