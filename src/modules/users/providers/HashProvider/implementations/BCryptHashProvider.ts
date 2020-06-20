import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8 /* tamanho do salt a ser utilizado */);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHashProvider;
