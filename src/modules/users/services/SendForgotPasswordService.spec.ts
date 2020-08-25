import AppErros from '@shared/errors/AppErros';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserstokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import SendForgotPasswordService from './SendForgotPasswordEmailService';

let fakeMailProvider: FakeMailProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserstokensRepository: FakeUserstokensRepository;
let sendForgotPasswordService: SendForgotPasswordService;

describe('SendForgotPassword', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserstokensRepository = new FakeUserstokensRepository();
    sendForgotPasswordService = new SendForgotPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserstokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const funcSendMailUsed = jest.spyOn(fakeMailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gmail.com',
      password: '1234',
    });

    await sendForgotPasswordService.run({ email: user.email });

    expect(funcSendMailUsed).toHaveBeenCalled();
  });
  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordService.run({ email: 'lapisdasilva@gmail.com' }),
    ).rejects.toBeInstanceOf(AppErros);
  });
  it('should generate a forgot password token', async () => {
    const funcGenerateToken = jest.spyOn(fakeUserstokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gmail.com',
      password: '1234',
    });

    await sendForgotPasswordService.run({ email: 'lapisdasilva@gmail.com' });

    expect(funcGenerateToken).toHaveBeenCalledWith(user.id);
  });
});
