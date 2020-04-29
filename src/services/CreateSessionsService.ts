import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import AppErros from '../errors/AppErros';
import Users from '../models/Users';
import authConfig from '../config/auth';

interface RequestRun {
  email: string;
  password: string;
}

interface ResponseRun {
  user: Users;
  token: string;
}

class CreateSessionsService {
  public async run({ email, password }: RequestRun): Promise<ResponseRun> {
    const userRepository = getRepository(Users);

    const user = await userRepository.findOne({ where: { email } });

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
