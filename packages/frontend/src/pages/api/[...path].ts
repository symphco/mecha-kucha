import type {NextApiHandler} from "next";
import * as config from '@/config';

const handler: NextApiHandler = async (req, res) => {
  const pathRaw = req.query.path as string[];
  const path = pathRaw.join('/');

  const response = await fetch(
    new URL(`/api/${path}`, config.backend.baseUrl).toString(),
    {
      method: req.method,
      body: JSON.stringify(req.body),
      headers: {
        'Authorization': `${req.cookies['accessTokenType']} ${req.cookies['accessToken']}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const details = await response.json();
    res.status(response.status === 401 ? 401 : 502).json(details);
    return;
  }

  if (response.headers.get('Content-Type')?.startsWith('application/json')) {
    res.json(await response.json());
    return;
  }
  res.json(await response.text());

  // TODO error handling!
  // TODO add slide captions when there are no images
  // TODO user to be able to select which image generator to use
  // TODO upload your own image
  // TODO upload source code from file (automatic syntax highlighting)
  // TODO proper sign-in screen for Google
  return;
};

export default handler;
