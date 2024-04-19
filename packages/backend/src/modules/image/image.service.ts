import {ImageSlotContent, MAXIMUM_IMAGES, Slide} from '@symphco/mecha-kucha-common';
import * as config from '../../config';

export interface ImageService {
  generateSingleImage(slide: Slide, index: number): Promise<ImageSlotContent>;
  generateSlideImages(slide: Partial<Slide>): Promise<ImageSlotContent[]>;
}

export class ImageServiceImpl implements ImageService {
  constructor(private readonly source: string) {
    // noop
  }

  async generateSingleImage(slide: Slide, index: number) {
    switch (this.source) {
      case 'unsplash': {
        const url = new URL(
          config.content[this.source].endpoint,
          config.content[this.source].baseUrl
        );
        url.search = new URLSearchParams({
          page: '1', // TODO get next pages!
          query: slide.theme as string,
          client_id: config.content[this.source].clientId,
        }).toString();
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error from Unsplash API.');
        }

        const json = await response.json() as {
          results: {
            urls: {
              regular: string
            }
          }[]
        };

        return {
          type: 'image',
          url: json.results[0].urls.regular
        } as ImageSlotContent;
      }
      default:
        break;
    }

    const now = Date.now();
    return {
      type: 'image',
      url: `https://picsum.photos/seed/${slide.id}-${index}-${now}/200`,
    } as ImageSlotContent;
  }

  async generateSlideImages(slide: Partial<Slide>): Promise<ImageSlotContent[]> {
    switch (this.source) {
      case 'unsplash': {
        const url = new URL(
          config.content[this.source].endpoint,
          config.content[this.source].baseUrl
        );
        url.search = new URLSearchParams({
          page: '1', // TODO get next pages!
          query: slide.theme as string,
          client_id: config.content[this.source].clientId,
        }).toString();
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error from Unsplash API.');
        }

        const json = await response.json() as {
          results: {
            urls: {
              regular: string
            }
          }[]
        };

        return json
          .results
          .slice(0, MAXIMUM_IMAGES)
          .map((s) => ({
            type: 'image',
            url: s.urls.regular,
          })) as ImageSlotContent[];
      }
      default:
        break;
    }

    const now = Date.now();
    const theObtainedUrls = [
      `https://picsum.photos/seed/${slide.id}-0-${now}/200`,
      `https://picsum.photos/seed/${slide.id}-1-${now}/200`,
      `https://picsum.photos/seed/${slide.id}-2-${now}/200`,
      `https://picsum.photos/seed/${slide.id}-3-${now}/200`,
      `https://picsum.photos/seed/${slide.id}-4-${now}/200`,
    ];
    return (
      Array.isArray(slide.slots)
        ? [
          ...(theObtainedUrls.slice(0, slide.visibleSlots ?? MAXIMUM_IMAGES).map((s) => ({
            type: 'image',
            url: s,
          }))),
          slide.slots.slice(slide.visibleSlots ?? MAXIMUM_IMAGES)
        ]
        : theObtainedUrls.map((s) => ({
          type: 'image',
          url: s,
        }))
    ) as ImageSlotContent[];
  }
}
