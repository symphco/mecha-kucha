import {AuthParams, AuthCallbackParams, AuthInputParams, AccessTokenResponse} from '../../models';
import * as config from '../../config';

export interface AuthService {
  getAuthParams(inputParams: AuthInputParams): AuthParams;
  exchangeAuthCallbackParamsForAccessToken(callbackParams: AuthCallbackParams): Promise<AccessTokenResponse>;
}

export class AuthServiceImpl implements AuthService {
  constructor(private readonly provider: string) {
    // noop
  }

  getAuthParams(inputParams: AuthInputParams) {
    switch (this.provider) {
      case 'google': {
        const redirectUrl = new URL(
          config.auth.google.endpoint,
          config.auth.google.baseUrl,
        );
        redirectUrl.search = new URLSearchParams({
          ...inputParams,
          scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/presentations',
            'https://www.googleapis.com/auth/drive',
          ].join(' '),
          response_type: 'code',
          client_id: config.auth.google.clientId,
        }).toString();

        return {
          redirectUrl: redirectUrl.toString(),
        };
      }
      default:
        break;
    }

    throw new Error('Invalid auth provider.');
  }

  async exchangeAuthCallbackParamsForAccessToken(etcCallbackParams: AuthCallbackParams) {
    switch (this.provider) {
      case 'google': {
        const accessTokenResponse = await fetch(
          new URL(
            config.auth.google.tokenEndpoint,
            config.auth.google.tokenBaseUrl,
          ).toString(),
          {
            method: 'POST',
            body: JSON.stringify({
              ...etcCallbackParams,
              grant_type: 'authorization_code',
              client_id: config.auth.google.clientId,
              client_secret: config.auth.google.clientSecret,
            }),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!accessTokenResponse.ok) {
          const errorDetail = await accessTokenResponse.json();
          throw new Error('Invalid callback params', {
            cause: errorDetail,
          });
        }

        const r = await accessTokenResponse.json() as Record<string, unknown>;
        if (
          'access_token' in r
          && typeof r.access_token === 'string'
          && 'token_type' in r
          && typeof r.token_type === 'string'
        ) {
          return {
            accessToken: r.access_token,
            accessTokenType: r.token_type,
            idToken: r.id_token,
            expiresIn: r.expires_in,
          };
        }

        throw new Error('Invalid callback response');
      }
      default:
        break;
    }

    throw new Error('Invalid auth provider.');
  }
}
