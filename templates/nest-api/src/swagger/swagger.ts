import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { defaultVersions } from '../helpers';
import { API_VERSION, API_PREFIX } from '@msa/constants';
import { SWAGGER_API_NAME, SWAGGER_API_DESCRIPTION } from './constants';

function filterByVersion(swaggerDoc: OpenAPIObject) {
  const { version } = swaggerDoc.info;

  const versionPaths = {};
  Object.keys(swaggerDoc.paths)
    .filter((key) => key.match(new RegExp(`^((/${version})|(?!/v\\d/))/.*`)))
    .forEach((key) => (versionPaths[key] = swaggerDoc.paths[key]));

  swaggerDoc.paths = versionPaths;

  return swaggerDoc;
}

function setSwaggerJsonUrl(version: string): string {
  const hostUrl = `${process.env.API_URL}:3000`;

  return `${hostUrl}/${API_PREFIX}/v${version}/docs-json`;
}

export const setupSwagger = (app: INestApplication) => {
  const documents = defaultVersions().reduce((acc, curr) => {
    const options = new DocumentBuilder()
      .setTitle(SWAGGER_API_NAME)
      .setDescription(SWAGGER_API_DESCRIPTION)
      .setVersion(`v${curr}`)
      .addBearerAuth()
      .build();
    return { ...acc, [curr]: SwaggerModule.createDocument(app, options) };
  }, {});

  defaultVersions().forEach((version) => {
    const document = documents[version];
    SwaggerModule.setup(
      `${API_PREFIX}/v${version}/docs`,
      app,
      filterByVersion(document),
    );
  });

  SwaggerModule.setup(
    `${API_PREFIX}/docs`,
    app,
    filterByVersion(documents[API_VERSION.toString()]),
    {
      explorer: true,
      swaggerOptions: {
        urls: defaultVersions()
          .sort()
          .reverse()
          .map((version) => ({
            url: setSwaggerJsonUrl(version),
            name: `API v${version}`,
          })),
      },
    },
  );
};
