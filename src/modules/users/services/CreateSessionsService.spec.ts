import AppErros from '@shared/errors/AppErros';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeBCryptHashProvider from '../providers/HashProvider/fakes/FakeBCryptHashProvider';
import CreateSessionsService from './CreateSessionsService';
import CreateUsersService from './CreateUsersService';

describe('SessionsUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeBCryptHashProvider = new FakeBCryptHashProvider();

    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeBCryptHashProvider,
    );

    const createSessionsService = new CreateSessionsService(
      fakeUsersRepository,
      fakeBCryptHashProvider,
    );

    await createUsersService.run({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gamil.com',
      password: '1234',
    });

    const response = await createSessionsService.run({
      email: 'lapisdasilva@gamil.com',
      password: '1234',
    });

    expect(response).toHaveProperty('token');
  });
  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeBCryptHashProvider = new FakeBCryptHashProvider();

    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeBCryptHashProvider,
    );

    const createSessionsService = new CreateSessionsService(
      fakeUsersRepository,
      fakeBCryptHashProvider,
    );

    await createUsersService.run({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gamil.com',
      password: '1234',
    });

    await expect(
      createSessionsService.run({
        email: 'pessoapassaro@gamil.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppErros);
  });
  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeBCryptHashProvider = new FakeBCryptHashProvider();

    const createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeBCryptHashProvider,
    );

    const createSessionsService = new CreateSessionsService(
      fakeUsersRepository,
      fakeBCryptHashProvider,
    );

    await createUsersService.run({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gamil.com',
      password: '1234',
    });

    await expect(
      createSessionsService.run({
        email: 'lapisdasilva@gamil.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppErros);
  });
});
