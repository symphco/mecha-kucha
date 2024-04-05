import type {NextApiHandler} from "next";
import type {AppState} from '@/common';
import {createNewPresentation} from '@/backend/presentation';
import {CreatePresentationError, UnauthorizedError} from '@/backend/response';

const handler: NextApiHandler = async (req, res) => {
  const appState = req.body as AppState;

  let newPresentation;
  try {
    const createNewPresentationFn = createNewPresentation(req.cookies.tokenType, req.cookies.accessToken);
    newPresentation = await createNewPresentationFn(appState);
  } catch (errRaw) {
    if (errRaw instanceof UnauthorizedError) {
      res.status(401).send({
        message: errRaw.message,
      });

      return;
    }

    if (errRaw instanceof CreatePresentationError) {
      res.status(502).send(errRaw);

      return;
    }

    res.status(500).send(errRaw);
    return;
  }

  res.json(newPresentation);

  // TODO error handling!
  // TODO add slide captions when there are no images
  // TODO user to be able to select which image generator to use
  // TODO upload your own image
  // TODO upload source code from file (automatic syntax highlighting)
  // TODO proper sign-in screen for Google
  return;
};

export default handler;
