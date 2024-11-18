import path from 'path';
import fs from 'fs';
import { DocumentNode } from 'graphql';

type ImportModules = {
  typeDefs: DocumentNode;
  resolvers: any;
};

export async function importModules(): Promise<ImportModules[]> {
  const directory = ['development', 'test'].includes(process.env.NODE_ENV) ? 'src' : 'dist';
  const resourcesPath = path.resolve(process.cwd(), directory, 'resources');

  return await Promise.all(
    fs
      .readdirSync(resourcesPath)
      .filter((domain: string) => fs.lstatSync(path.resolve(resourcesPath, domain)).isDirectory())
      .map(async (domain: string) => {
        const { default: schema } = await import(path.resolve(resourcesPath, domain, `${domain}.schema`));
        const { default: resolvers } = await import(path.resolve(resourcesPath, domain, `${domain}.resolvers`));
        return { typeDefs: schema, resolvers: resolvers };
      })
  );
}
