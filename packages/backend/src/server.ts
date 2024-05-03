import fastify from 'fastify';
import { fastifyCors } from '@fastify/cors';

export interface CreateServerOptions {
  logger?: boolean;
  clientUrls?: string | string[];
}

export const createServer = async (options = {} as CreateServerOptions) => {
  const { clientUrls: clientUrlsRaw = [], logger } = options;
  const server = fastify({
    logger,
  });

  const clientUrls = Array.isArray(clientUrlsRaw) ? clientUrlsRaw : [clientUrlsRaw];
  if (clientUrls.length > 0) {
    await server.register(fastifyCors, {
      origin: clientUrls,
    });
  }

  return server;
};
