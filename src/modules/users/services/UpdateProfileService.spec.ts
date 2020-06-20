/**
 * Teste unitário
 */
import AppError from '@shared/erros/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    // console.log(user);

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Janie Doe',
      email: 'janiedoe@exemple.com',
    });

    expect(updatedUser.name).toBe('Janie Doe');
    expect(updatedUser.email).toBe('janiedoe@exemple.com');
  });

  it('should not be able to change the email using an existing one', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Janie Doe',
      email: 'janiedoe@exemple.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Janie Doe',
        email: 'johndoe@exemple.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    // console.log(user);

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Janie Doe',
      email: 'janiedoe@exemple.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should be able to update the password without old password information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Janie Doe',
        email: 'janiedoe@exemple.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password with wrong old password information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Janie Doe',
        email: 'janiedoe@exemple.com',
        old_password: '321321',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'Fake_test_id',
        name: 'Janie Doe',
        email: 'janiedoe@exemple.com',
        old_password: '321321',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
