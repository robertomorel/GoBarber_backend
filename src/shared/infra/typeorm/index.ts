// import { createConnection } from 'typeorm';

/**
 * O "createConnection" vai procutar no projeto um arquivo "ormconfig.json" para
 * atribuir todas as configuração do Banco de Dados.
 * Estas configurações poderiam ser feitas diretamente aqui, porém, não é bom pq a
 * SLI (linha de comando) lê por padrão do "ormconfig.json"
 */
// createConnection();

import { createConnections } from 'typeorm';

createConnections();
