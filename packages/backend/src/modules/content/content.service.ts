import * as config from '../../config';

export interface ContentService {
  generate(title: string): Promise<string>;
}

export class ContentServiceImpl implements ContentService {
  constructor(private readonly source: string) {
    // noop
  }

  async generate(title: string) {
    if (title.trim().length < 1) {
      throw new Error('Title must not be empty.');
    }

    switch (this.source) {
      case 'airops': {
        const url = new URL(
          config.content[this.source].endpoint,
          config.content[this.source].baseUrl,
        );

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `${config.content[this.source].accessTokenAuthType} ${config.content[this.source].accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: title,
          }),
        });

        if (response.ok) {
          const responseBody = await response.json() as any;
          return responseBody.result.response as string;
        }

        const cause = await response.json();
        throw new Error('Error in response.', { cause });
      }
      default:
        break;
    }

    throw new Error('Unknown source.');
  }
}
