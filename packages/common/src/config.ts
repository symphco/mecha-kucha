export namespace image {
  export namespace sources {
    export namespace unsplash {
      export const name = 'Unsplash';
      export const baseUrl = process.env.UNSPLASH_API_BASE_URL as string;
      export const endpoint = process.env.UNSPLASH_API_ENDPOINT as string;
    }

    export namespace picsum {
      export const name = 'Picsum';
    }
  }
}

export namespace caption {
  export namespace sources {
    export namespace airops {
      export const name = 'Airops';
      export const endpoint = process.env.AIROPS_API_ENDPOINT as string;
      export const baseUrl = process.env.AIROPS_API_BASE_URL as string;
    }
  }
}

export namespace destinations {
  export namespace googleSlides {
    export const name = 'Google Slides';
    export const baseUrl = process.env.GOOGLE_SLIDES_API_BASE_URL as string;
    export const presentationsEndpoint = process.env.GOOGLE_SLIDES_API_PRESENTATIONS_ENDPOINT as string;
  }
}
