import {constants} from 'http2';
import {FastifyReply, FastifyRequest, RouteHandlerMethod} from 'fastify';
import {AppState} from '@symphco/mecha-kucha-common';
import {PresentationService} from './presentation.service';
import {CreatePresentationError, UnauthorizedError} from './presentation.response';

declare module 'fastify' {
  interface FastifyRequest {
    presentationService: PresentationService;
  }
}

export interface PresentationController extends Record<
  'createPresentation',
  RouteHandlerMethod
> {}

export class PresentationControllerImpl implements PresentationController {
  async createPresentation(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as AppState;
    try {
      const newPresentation = await request.presentationService.createNewPresentation(body);
      reply.send(newPresentation);
    } catch (errRaw) {
      if (errRaw instanceof UnauthorizedError) {
        reply.status(constants.HTTP_STATUS_UNAUTHORIZED).send(errRaw);
        return;
      }
      if (errRaw instanceof CreatePresentationError) {
        reply.status(constants.HTTP_STATUS_BAD_GATEWAY).send(errRaw);
        return;
      }
      reply.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(errRaw);
    }
  };
}
