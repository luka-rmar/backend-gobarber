import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const sessionsUsers = container.resolve(CreateSessionsService);

    const { email, password } = request.body;

    const { user, token } = await sessionsUsers.run({ email, password });

    delete user.password;

    return response.json({ user, token });
  }
}

export default SessionsController;
