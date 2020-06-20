/**
 * Está sendo criado este service para as seguintes regras de negócio:
 *    1. Caso o usuário suba uma imagem nova, uma antiga deve ser deletada
 *    2. Validar se o usuário autenticado existe
 */
// import { getRepository } from 'typeorm';
// import path from 'path';
// -- fs = filesystem
// import fs from 'fs';
import AppError from '@shared/erros/AppError';
// import uploadConfig from '@config/upload';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    // const usersRepository = getRepository(User);

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    /**
     * A forma correta de armazenar arquivos de avatares, por exemplo, é em Content Delivery Natwork
     * Exemplo: Amazon S3 / Google Cloud Storage / DO Space...
     */
    /*
    if (user.avatar) {
      // -- Deletar avatar anterior
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // -- Verifica se o avatar existe. A função stat traz o status do arquivo, se ele existir
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      // -- Se o avatar existir...
      if (userAvatarFileExists) {
        // -- Deleta com o unlink
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    */

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    // -- Atualiza o novo avatar no campo do model
    user.avatar = fileName;

    /**
     * O save() pode ser usado para salvar um novo usuário ou atualizar,
     * a depende do user possuir um id ou não
     */
    await this.usersRepository.save(user);

    return user;
  }
}
