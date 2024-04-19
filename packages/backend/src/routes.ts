import {FastifyInstance} from 'fastify';
import {PresentationController, PresentationControllerImpl, PresentationServiceImpl} from './modules/presentation';
import {AuthController, AuthControllerImpl, AuthServiceImpl} from './modules/auth';
import {ImageController, ImageControllerImpl, ImageServiceImpl} from './modules/image';
import {ContentController, ContentControllerImpl, ContentServiceImpl} from './modules/content';

export const addAuthRoutes = (server: FastifyInstance) => {
  const authController: AuthController = new AuthControllerImpl();
  const prefix = '/api/auth';

  server
    .addHook('onRequest', async (request) => {
      if (!request.url.startsWith(prefix)) {
        return;
      }

      const { provider } = request.params as { provider: string };
      request.authService = new AuthServiceImpl(provider);
    })
    .route({
      method: 'POST',
      url: `${prefix}/:provider`,
      handler: authController.getAuthParams,
    })
    .route({
      method: 'POST',
      url: `${prefix}/:provider/callback`,
      handler: authController.exchangeAuthCallbackParamsForAccessToken,
    });
};

export const addImagesRoutes = (server: FastifyInstance) => {
  const imageController: ImageController = new ImageControllerImpl();
  const prefix = '/api/images'

  server
    .addHook('onRequest', async (request) => {
      if (!request.url.startsWith(prefix)) {
        return;
      }

      const { source } = request.params as { source: string };
      request.imageService = new ImageServiceImpl(source);
    })
    .route({
      method: 'POST',
      url: `${prefix}/:source/generate-single`,
      handler: imageController.generateSingleImage,
    })
    .route({
      method: 'POST',
      url: `${prefix}/:source/generate`,
      handler: imageController.generateMultipleImages,
    });
};

export const addContentsRoutes = (server: FastifyInstance) => {
  const contentController: ContentController = new ContentControllerImpl();
  const prefix = '/api/contents';

  server
    .addHook('onRequest', async (request) => {
      if (!request.url.startsWith(prefix)) {
        return;
      }

      const { source } = request.params as { source: string };
      request.contentService = new ContentServiceImpl(source);
    })
    .route({
      method: 'POST',
      url: `${prefix}/:source/generate`,
      handler: contentController.generate,
    })
};

export const addPresentationsRoutes = (server: FastifyInstance) => {
  const presentationController: PresentationController = new PresentationControllerImpl();
  const prefix = '/api/presentations';

  server
    .addHook('onRequest', async (request) => {
      if (!request.url.startsWith(prefix)) {
        return;
      }

      const [tokenType, accessToken] = (request.headers.authorization ?? '').split(' ');
      request.presentationService = new PresentationServiceImpl(tokenType, accessToken);
    })
    .route({
      method: 'POST',
      url: prefix,
      handler: presentationController.createPresentation,
    });
};
