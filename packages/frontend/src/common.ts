export type ImageUrlCollection = [string?, string?, string?, string?, string?];

export const SLIDE_LAYOUTS = ['vertical-bars', 'horizontal-bars', 'grid-left', 'grid-right'] as const;

export type SlideLayout = typeof SLIDE_LAYOUTS[number];

export interface Slide {
  id: string;
  title: string;
  theme: string;
  layout: SlideLayout;
  visibleImages: number;
  text: string;
  imageUrls: ImageUrlCollection;
}

export interface AppState {
  title?: string;
  input?: string;
  slides?: Slide[];
}

export const MAXIMUM_IMAGES = 5 as const;
