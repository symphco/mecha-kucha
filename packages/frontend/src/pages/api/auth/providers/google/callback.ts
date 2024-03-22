import {NextApiHandler} from 'next';

const handler: NextApiHandler = async (req, res) => {
  if (req.method?.trim().toUpperCase() === 'OPTIONS' && req.headers.origin === 'https://accounts.google.com') {
    res.status(200).end();
    return;
  }

  const { code: responseCode } = req.query;
  const accessTokenResponse = await fetch(new URL('/token', 'https://oauth2.googleapis.com').toString(), {
    method: 'POST',
    body: JSON.stringify({
      code: responseCode,
      client_id: process.env.GOOGLE_CLOUD_OAUTH2_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLOUD_OAUTH2_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/api/auth/providers/google/callback',
      grant_type: 'authorization_code',
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const r = await accessTokenResponse.json();
  if ('access_token' in r && 'token_type' in r) {
    const {access_token: accessToken, token_type: tokenType} = r;
    res.setHeader('Set-Cookie', [
      `tokenType=${tokenType}; HttpOnly; Domain=localhost; Path=/`,
      `accessToken=${accessToken}; HttpOnly; Domain=localhost; Path=/`
    ])
  }
  res.setHeader('Location', '/');
  res.status(307).end();
};

export default handler;
