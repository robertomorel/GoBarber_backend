/**
 * SEMPRE QUE FAZEMOS INTEGRAÇÃO COM BLIOTECAS EXTERNAS, COM SERVIÇOS QUE PODEM MUDAR
 * COM O TEMPO, PRECISAMOS CRIAR ESTES PROVIDERS PARA NÃO HAVER MAIORES IMPACTOS
 * NA APLICAÇÃO. DESTE MODO, NÓS ISOLAMOS AS FUNCIONALIDADES DIRETAMENTE INTEGRADAS
 * COM ESTES SERVIÇOS.
 */
import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
