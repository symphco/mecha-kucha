import * as config from './config';

export type ImageSourceKey = keyof typeof config.image.sources;

export interface ImageSource {
  name: string;
  baseUrl?: string;
  endpoint?: string;
}

export const AVAILABLE_IMAGE_SOURCES = Object.fromEntries(
  Object.entries(config.image.sources).map(([key, value]) => [
    key,
    value,
  ])
) as Record<ImageSourceKey, ImageSource>;

export type CaptionSourceKey = keyof typeof config.caption.sources;

export interface CaptionSource {
  name: string;
  baseUrl: string;
  endpoint: string;
}

export const AVAILABLE_CAPTION_SOURCES = Object.fromEntries(
  Object.entries(config.caption.sources).map(([key, value]) => [
    key,
    value,
  ])
) as Record<CaptionSourceKey, CaptionSource>;

export interface Destination {
  name: string;
  baseUrl: string;
  presentationsEndpoint: string;
}

export type DestinationKey = keyof typeof config.destinations;

export const AVAILABLE_DESTINATIONS = Object.fromEntries(
  Object.entries(config.destinations).map(([key, value]) => [
    key,
    value,
  ])
) as Record<DestinationKey, Destination>;
