/**
 * Teste unitário
 */
import AppError from '@shared/erros/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update an user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    // console.log(user);

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update an avatar from none existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating a new one', async () => {
    // -- O Jest irá ficar observando uma função dentro do fakeStorageProvider
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    // -- Espero que a função deleteFile seja chamada com o parâmetro 'avatar.jpg'
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
