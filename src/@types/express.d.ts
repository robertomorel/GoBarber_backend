/**
 * Modo de sobrescrever uma tipagem do Express
 *
 * Neste caso, sobrescreveremos a tipagem/exportação (interface) do Request.
 * Será adicionado no Request uma informação nova, que é o 'user'
 */
declare namespace Express {
  export interface Request {
    // -- Será anexado o que colocaremos aqui junto com o Request que já existe no express
    user: {
      id: string;
    };
  }
}
