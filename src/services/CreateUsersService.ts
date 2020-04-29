import { getRepository } from 'typeorm';
import { hash } from 'bcrypt';

import AppErros from '../errors/AppErros';
import Users from '../models/Users';

interface RequestRun {
  name: string;
  email: string;
  password: string;
}

class CreateUsersService {
  public async run({ name, email, password }: RequestRun): Promise<Users> {
    const usersRepository = getRepository(Users);

    const verifyEmailExists = await usersRepository.findOne({
      where: { email },
    });

    if (verifyEmailExists) {
      throw new AppErros('Email address already used');
    }

    const passwordHashed = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: passwordHashed,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUsersService;
