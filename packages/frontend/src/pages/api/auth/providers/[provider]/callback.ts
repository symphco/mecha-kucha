import {NextApiHandler} from 'next';
import * as config from '@/config';

const handler: NextApiHandler = async (req, res) => {
  if (req.method?.trim().toUpperCase() === 'OPTIONS' && req.headers.origin === 'https://accounts.google.com') {
    res.status(200).end();
    return;
  }

  const { code: responseCode, provider } = req.query;
  const redirectUriOauthRaw = new URL(
    `/api/auth/providers/${provider}/callback`,
    config.meta.baseUrl,
  );
  const redirectUriOauth = new URL(
    redirectUriOauthRaw.pathname,
    config.meta.host === '0.0.0.0' ? `${redirectUriOauthRaw.protocol}//localhost:${config.meta.port}` : config.meta.baseUrl
  ).toString();
  const accessTokenResponse = await fetch(
    new URL(
      `/api/auth/${provider}/callback`,
      config.backend.baseUrl,
    ).toString(),
    {
      method: 'POST',
      body: JSON.stringify({
        redirect_uri: redirectUriOauth,
        code: responseCode,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
  );
  const r = await accessTokenResponse.json();
  if ('accessToken' in r && 'accessTokenType' in r) {
    const theHost = config.meta.host === '0.0.0.0' ? 'localhost' : config.meta.host;
    res.setHeader('Set-Cookie', Object.entries(r).map(([key, value]) => {
      return `${key}=${value}; HttpOnly; Domain=${theHost}; Path=/`;
    }));
  }
  res.setHeader('Location', '/'); // TODO keep URL and state
  res.status(307).end();
};

export default handler;
