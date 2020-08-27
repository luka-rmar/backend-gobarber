import { Repository, getRepository } from 'typeorm';

import IUsersTokensRepository from '@modules/users/repositories/IUsersTokensRepository';
import UsersToken from '../entities/UsersTokens';

class UsersTokensRepository implements IUsersTokensRepository {
  private ormRepository: Repository<UsersToken>;

  constructor() {
    this.ormRepository = getRepository(UsersToken);
  }

  public async generate(user_id: string): Promise<UsersToken> {
    const userToken = this.ormRepository.create({ user_id });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UsersToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }
}

export default UsersTokensRepository;
