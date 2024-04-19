import { createServer } from './server';

import {addAuthRoutes, addContentsRoutes, addImagesRoutes, addPresentationsRoutes} from './routes';

import * as config from './config';

const server = createServer({
  logger: config.meta.env !== 'test',
});

addAuthRoutes(server);
addPresentationsRoutes(server);
addImagesRoutes(server);
addContentsRoutes(server);

server
  .listen({ port: config.meta.port, host: config.meta.host }, (err) => {
    if (err) {
      server.log.error(err.message);
      process.exit(1);
    }
  });
