import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUsersService from '@modules/users/services/UpdateUsersAvatarService';

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUsersService);

    const user = await updateUserAvatar.run({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    delete user.password;

    return response.json(user);
  }
}

export default UserAvatarController;
