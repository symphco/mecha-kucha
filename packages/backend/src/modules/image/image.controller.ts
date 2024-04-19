import {FastifyReply, FastifyRequest, RouteHandlerMethod} from 'fastify';
import {ImageService} from './image.service';
import {Slide} from '@symphco/mecha-kucha-common';

declare module 'fastify' {
  interface FastifyRequest {
    imageService: ImageService;
  }
}

export interface ImageController extends Record<
  'generateSingleImage' | 'generateMultipleImages',
  RouteHandlerMethod
> {}

export class ImageControllerImpl implements ImageController {
  async generateSingleImage(request: FastifyRequest, reply: FastifyReply) {
    const { index } = request.query as { index: number };
    const content = await request.imageService.generateSingleImage(
      request.body as Slide,
      index,
    );
    reply.send(content);
  }

  async generateMultipleImages(request: FastifyRequest, reply: FastifyReply) {
    const content = await request.imageService.generateSlideImages(request.body as Slide);
    reply.send(content);
  }
}
