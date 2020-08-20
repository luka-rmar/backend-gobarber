import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUsersService from '@modules/users/services/CreateUsersService';

class UsersConteller {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUsersService);

    const user = await createUser.run({ name, email, password });

    delete user.password;

    return response.json(user);
  }
}

export default UsersConteller;
