import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPassworEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPassworEmailService = container.resolve(
      SendForgotPassworEmailService,
    );
    console.log(email);

    await sendForgotPassworEmailService.run({ email });

    return response.status(204).json();
  }
}
