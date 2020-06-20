import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  /**
   * Objeto cuja variável é key, do tipo string e o valor é uma string tb.
   */
  [key: string]: string;
}

export default class RedisCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    // -- Salva valor no array
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    // -- Busca valor a partir do indice do array
    const data = this.cache[key];

    // -- Se não tiver valor, retorna
    if (!data) return null;

    // -- Se tiver valor, transforma em JSON e retorna
    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    // -- Deleta o valor a partir do indice
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
