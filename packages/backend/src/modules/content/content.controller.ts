import {FastifyReply, FastifyRequest, RouteHandlerMethod} from 'fastify';
import {ContentService} from './content.service';

declare module 'fastify' {
  interface FastifyRequest {
    contentService: ContentService;
  }
}

export interface ContentController extends Record<'generate', RouteHandlerMethod> {}

export class ContentControllerImpl implements ContentController {
  async generate(request: FastifyRequest, reply: FastifyReply) {
    const { title } = request.body as { title: string };
    const content = await request.contentService.generate(title);
    reply.send(content);
  }
}
