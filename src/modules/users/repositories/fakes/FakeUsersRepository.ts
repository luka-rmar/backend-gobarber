import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICrrateUserDTO';
import Users from '../../infra/typeorm/entities/Users';

class UsersRepository implements IUsersRepository {
  users: Users[] = [];

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<Users> {
    const user = new Users();

    Object.assign(user, { id: uuid(), name, email, password });

    this.users.push(user);

    return user;
  }

  public async save(userData: Users): Promise<Users> {
    const findIndex = this.users.findIndex(user => user.id === userData.id);

    this.users[findIndex] = userData;

    return userData;
  }

  public async findByEmail(email: string): Promise<Users | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findById(id: string): Promise<Users | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }
}

export default UsersRepository;
