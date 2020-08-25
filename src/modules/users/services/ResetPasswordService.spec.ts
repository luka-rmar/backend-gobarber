import AppErros from '@shared/errors/AppErros';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeBCryptHashProvider';
import ResetPassswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserstokensRepository: FakeUsersTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassswordService: ResetPassswordService;

describe('ResetPasssword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserstokensRepository = new FakeUsersTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassswordService = new ResetPassswordService(
      fakeUsersRepository,
      fakeUserstokensRepository,
      fakeHashProvider,
    );
  });
  it('should be able to reset the password', async () => {
    const funcGenerateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUsersRepository.create({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gamil.com',
      password: '1234',
    });

    const { token } = await fakeUserstokensRepository.generate(user.id);

    const uptadedUserPassword = await resetPassswordService.run({
      token,
      password: '12345',
    });

    const updatedPassword = await fakeUsersRepository.findById(user.id);

    await expect(funcGenerateHash).toHaveBeenCalledWith('12345');
    await expect(updatedPassword?.password).toBe(uptadedUserPassword.password);
  });
  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassswordService.run({ token: 'not existis', password: '1234' }),
    ).rejects.toBeInstanceOf(AppErros);
  });
  it('should not be able to reset the password whit non-existing user', async () => {
    const { token } = await fakeUserstokensRepository.generate(
      'new-id-fake-test',
    );

    await expect(
      resetPassswordService.run({ token, password: '1234' }),
    ).rejects.toBeInstanceOf(AppErros);
  });
  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gamil.com',
      password: '1234',
    });

    const { token } = await fakeUserstokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customHours = new Date();
      return customHours.setHours(customHours.getHours() + 3);
    });

    await expect(
      resetPassswordService.run({ token, password: '12345' }),
    ).rejects.toBeInstanceOf(AppErros);
  });
});
