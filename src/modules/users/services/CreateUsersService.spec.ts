import AppErros from '@shared/errors/AppErros';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeBCryptHashProvider from '../providers/HashProvider/fakes/FakeBCryptHashProvider';
import CreateUsersService from './CreateUsersService';

describe('CreateUsers', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeBCryptHashProvider = new FakeBCryptHashProvider();
    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeBCryptHashProvider,
    );

    const user = await createUsersService.run({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gamil.com',
      password: '1234',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Lapis da Silva');
  });
  it('should be able to create two users with the same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeBCryptHashProvider = new FakeBCryptHashProvider();

    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeBCryptHashProvider,
    );

    await createUsersService.run({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gamil.com',
      password: '1234',
    });

    await expect(
      createUsersService.run({
        name: 'Pessoa Passaro',
        email: 'lapisdasilva@gamil.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppErros);
  });
});
