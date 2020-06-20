/**
 * - Necessário ter o Multer -
 * yarn add multer
 * yarn add -D @types/multer
 */
import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,

  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      // -- filename é uma função que recebe o request, o arquivo e um callback(outra função)
      filename(request, file, callback) {
        // -- Cria uma criptografia de 10 bytes de texto e converte para hexadecimal
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;
        // -- callback (erro, nome do arquivo)
        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber-2',
    },
  },
} as IUploadConfig;
