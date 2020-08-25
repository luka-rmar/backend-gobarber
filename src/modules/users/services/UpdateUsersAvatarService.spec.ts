import AppErros from '@shared/errors/AppErros';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUsersAvatarService from './UpdateUsersAvatarService';

describe('UpdateUSersAvatar', () => {
  it('should be able to update a avatar of user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUsersavatarService = new UpdateUsersAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gmail.com',
      password: '1234',
    });

    const updatedUserAvatar = await updateUsersavatarService.run({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(updatedUserAvatar.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from not existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUsersavatarService = new UpdateUsersAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUsersavatarService.run({
        user_id: 'no-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppErros);
  });
  it('shold delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStoragePRovider = new FakeStorageProvider();

    const updateUsersAvatarService = new UpdateUsersAvatarService(
      fakeUsersRepository,
      fakeStoragePRovider,
    );

    const funcDeleteAvatarOld = jest.spyOn(fakeStoragePRovider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Lapis da Silva',
      email: 'lapisdasilva@gmail.com',
      password: '1234',
    });

    await updateUsersAvatarService.run({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUsersAvatarService.run({
      user_id: user.id,
      avatarFilename: 'avatar02.jpg',
    });

    expect(funcDeleteAvatarOld).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar02.jpg');
  });
});
