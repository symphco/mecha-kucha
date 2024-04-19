export namespace meta {
  const defaultPort = 3000;
  export const port = Number(process.env.PORT ?? defaultPort);

  const defaultHost = '0.0.0.0';
  export const host = process.env.HOST ?? defaultHost;

  const defaultBaseUrl = `http://${host}:${port}`;
  export const baseUrl = process.env.BASE_URL ?? defaultBaseUrl;

  const defaultEnv = 'production';
  export const env = process.env.NODE_ENV ?? defaultEnv;
}

export namespace backend {
  export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL as string;
}
