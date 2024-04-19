import fastify from 'fastify';

export interface CreateServerOptions {
  logger?: boolean;
}

export const createServer = (options = {} as CreateServerOptions) => {
  const server = fastify({
    logger: options.logger,
  });

  // TODO customize

  return server;
};
