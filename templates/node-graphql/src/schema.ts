import { importModules } from '@dataminr/lib';
import { buildSubgraphSchema } from '@apollo/federation';

export const schema = await (async function buildSchema() {
  const schemaDefs = await importModules();
  return buildSubgraphSchema(schemaDefs);
})();
