/*
https://nodemailer.com/transports/ses/
*/

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { inject, injectable } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    /**
     * A SDK da AWS lê automaticamente as variáveis de ambiente
     * AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY_ID e AWS_DEFAULT_REGION para fazer o
     * login e autenticação
     * */
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1',
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

export default SESMailProvider;
