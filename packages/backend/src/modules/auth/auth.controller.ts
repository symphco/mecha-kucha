import {AuthService} from './auth.service';
import {FastifyReply, FastifyRequest, RouteHandlerMethod} from 'fastify';
import {AuthCallbackParams, AuthInputParams} from '../../models';

declare module 'fastify' {
  interface FastifyRequest {
    authService: AuthService;
  }
}

export interface AuthController extends Record<
  'getAuthParams' | 'exchangeAuthCallbackParamsForAccessToken',
  RouteHandlerMethod
> {}

export class AuthControllerImpl implements AuthController {
  async getAuthParams(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as AuthInputParams;
    const authParams = request.authService.getAuthParams(body);
    reply.send(authParams);
  }

  async exchangeAuthCallbackParamsForAccessToken(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as AuthCallbackParams;
    const accessToken = await request.authService.exchangeAuthCallbackParamsForAccessToken(body);
    reply.send(accessToken);
  }
}
