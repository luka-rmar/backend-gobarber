import { hash } from 'bcrypt';
import { injectable, inject } from 'tsyringe';

import AppErros from '@shared/errors/AppErros';
import Users from '../infra/typeorm/entities/Users';
import IUsersRepository from '../repositories/IUsersRepository';

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
  ) {}

  public async run({ name, email, password }: IRequestRun): Promise<Users> {
    const verifyEmailExists = await this.usersRepository.findByEmail(email);

    if (verifyEmailExists) {
      throw new AppErros('Email address already used');
    }

    const passwordHashed = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHashed,
    });

    return user;
  }
}

export default CreateUsersService;
