import {NextApiHandler} from 'next';
import * as config from '@/config';

const handler: NextApiHandler = async (req, res) => {
  const { provider } = req.query as { provider: string };
  const redirectUriOauthRaw = new URL(
    `/api/auth/providers/${provider}/callback`,
    config.meta.baseUrl,
  );
  const redirectUriOauth = new URL(
    redirectUriOauthRaw.pathname,
    config.meta.host === '0.0.0.0' ? `${redirectUriOauthRaw.protocol}//localhost:${config.meta.port}` : config.meta.baseUrl
  ).toString();
  const authParamsResponse = await fetch(
    new URL(
      `/api/auth/${provider}`,
      config.backend.baseUrl,
    ).toString(),
    {
      method: 'POST',
      body: JSON.stringify({
        redirect_uri: redirectUriOauth,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
  );
  if (authParamsResponse.ok) {
    const authParams = await authParamsResponse.json();
    switch (provider) {
      case 'google': {
        const { redirectUrl } = authParams;
        return res.redirect(redirectUrl);
      }
      default:
        break;
    }

    res.status(400).end();
    return;
  }

  res.status(502).end();
};

export default handler;
