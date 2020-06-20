/*
-> Amazon S3
    - É um CDN (Content Delivery Network)
    - Porque vamos usar em ambiente de produção?
        > Pq quando colocamos nossa aplicação online, os servidores são muito otimizados para performance
        e com pouco espaço em disco. Geralmente usam SSD.
        > Ou seja, o espaço para a aplicação é pequeno.
        > Deste modo, não dá pra ficar salvando imagens ou arquivos no mesmo servidor da aplicação.
    - Quando colocamos uma aplicação online com o NODEjs
        > Escala vertical: aplicação tá lenta? Aumenta os recursos.
        > Escala horizontal: aplicação tá lenta? Criar outros servidores e faz a aplicação rodar em mais de um servidor
        com balanceamento de carga.
    - https://aws.amazon.com/pt/console
*/
// -- fs = filesystem
import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    // -- Para fazer a conexão com o S3
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalPath);

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error('File not fount!');
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        // -- Para que o conteúdo do arquivo possa ser visto no navegaro sem maiores problemas
        // ---------------------------------------------
        ContentType: contentType,
        ContentDisposition: `inline; filename=${file}`,
        // ---------------------------------------------
      })
      .promise();

    // -- Deletar o arquivo do fs logo após subir ao servidor
    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
