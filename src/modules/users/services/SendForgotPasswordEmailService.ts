import { inject, injectable } from 'tsyringe';
import path from 'path';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppErros from '@shared/errors/AppErros';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokensRepository from '../repositories/IUsersTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotEmailPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
  ) {}

  public async run({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppErros('User doest not exists');
    }

    const fileTemplateMail = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    const { token } = await this.usersTokensRepository.generate(user.id);

    await this.mailProvider.sendMail({
      to: { name: user.name, email: user.email },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: fileTemplateMail,
        variables: {
          name: user.name,
          link: `http://localhost:3000/password_reset?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotEmailPasswordService;
