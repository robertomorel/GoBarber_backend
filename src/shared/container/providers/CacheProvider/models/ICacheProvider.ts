export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  // -- Usando Generics para passar um argumento como tipo de retorno
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
