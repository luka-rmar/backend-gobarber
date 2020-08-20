import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppErros from '@shared/errors/AppErros';
import Users from '../infra/typeorm/entities/Users';
import authConfig from '../../../config/auth';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestRun {
  email: string;
  password: string;
}

interface IResponseRun {
  user: Users;
  token: string;
}

@injectable()
class CreateSessionsService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
  ) {}

  public async run({ email, password }: IRequestRun): Promise<IResponseRun> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppErros('Incorrect email/password combination.');
    }

    const { expiresIn, sercret } = authConfig.jwt;

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppErros('Incorrect email/password combination.');
    }

    const token = sign({}, sercret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
export default CreateSessionsService;
