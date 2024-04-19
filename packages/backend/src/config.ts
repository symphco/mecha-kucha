export namespace meta {
  const defaultPort = 8080;
  export const port = Number(process.env.PORT ?? defaultPort);

  const defaultHost = '0.0.0.0';
  export const host = process.env.HOST ?? defaultHost;

  const defaultEnv = 'production';
  export const env = process.env.NODE_ENV ?? defaultEnv;
}

export namespace frontend {
  export const baseUrl = process.env.FRONTEND_BASE_URL as string;
}

export namespace auth {
  export namespace google {
    export const baseUrl = process.env.GOOGLE_CLOUD_OAUTH2_BASE_URL as string;
    export const endpoint = process.env.GOOGLE_CLOUD_OAUTH2_ENDPOINT as string;
    export const clientId = process.env.GOOGLE_CLOUD_OAUTH2_CLIENT_ID as string;
    export const clientSecret = process.env.GOOGLE_CLOUD_OAUTH2_CLIENT_SECRET as string;
    export const tokenBaseUrl = process.env.GOOGLE_CLOUD_OAUTH2_TOKEN_BASE_URL as string;
    export const tokenEndpoint = process.env.GOOGLE_CLOUD_OAUTH2_TOKEN_ENDPOINT as string;
  }
}

export namespace content {
  export namespace unsplash {
    export const baseUrl = process.env.UNSPLASH_API_BASE_URL as string;
    export const endpoint = process.env.UNSPLASH_API_ENDPOINT as string;
    export const clientId = process.env.UNSPLASH_API_CLIENT_ID as string;
    export const clientSecret = process.env.UNSPLASH_API_CLIENT_SECRET as string;
  }

  export namespace airops {
    export const endpoint = process.env.AIROPS_API_ENDPOINT as string;
    export const baseUrl = process.env.API_BASE_URL as string;
    export const accessToken = process.env.AIROPS_API_ACCESS_TOKEN as string;
    export const accessTokenAuthType = process.env.AIROPS_API_ACCESS_TOKEN_TYPE as string;
  }

  export namespace googleSlides {
    export const baseUrl = process.env.GOOGLE_SLIDES_API_BASE_URL as string;
    export const presentationsEndpoint = process.env.GOOGLE_SLIDES_API_PRESENTATIONS_ENDPOINT as string;
  }
}
