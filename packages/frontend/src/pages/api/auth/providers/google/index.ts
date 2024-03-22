import {NextApiHandler} from 'next';

const handler: NextApiHandler = async (req, res) => {
  const redirectUrl = new URL(
    '/o/oauth2/v2/auth',
    'https://accounts.google.com'
  );
  redirectUrl.search = new URLSearchParams({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/presentations',
      'https://www.googleapis.com/auth/drive',
    ].join(' '),
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/api/auth/providers/google/callback',
    client_id: process.env.GOOGLE_CLOUD_OAUTH2_CLIENT_ID as string,
  }).toString();
  return res.redirect(redirectUrl.toString());
};

export default handler;
