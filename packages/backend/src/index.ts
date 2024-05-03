import { createServer } from './server';

import {
  addAuthRoutes,
  addContentsRoutes,
  addImagesRoutes,
  addPresentationsRoutes,
} from './routes';

import * as config from './config';

const main = async (c: typeof config) => {
  const server = await createServer({
    logger: c.meta.env !== 'test',
    clientUrls: c.frontend.baseUrl,
  });

  addAuthRoutes(server);
  addPresentationsRoutes(server);
  addImagesRoutes(server);
  addContentsRoutes(server);

  server
    .listen({ port: c.meta.port, host: c.meta.host }, (err) => {
      if (err) {
        server.log.error(err.message);
        process.exit(1);
      }
    });
};

void main(config);
