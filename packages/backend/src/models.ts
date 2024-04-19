interface PresentationObject {
  objectId: string;
}

interface Page {
  pageElements: PresentationObject[];
}

interface SlideProperties {
  notesPage: Page;
}

interface PresentationSlide extends PresentationObject {
  slideProperties: SlideProperties;
}

interface PresentationLayout extends PresentationObject {}

interface PresentationMaster extends PresentationObject {
  pageElements: PresentationObject[];
}

interface Length {
  magnitude: number;
  unit: string;
}

interface Size {
  width: Length;
  height: Length;
}

export interface Presentation {
  presentationId: string;
  slides: PresentationSlide[];
  layouts: PresentationLayout[];
  masters: [PresentationMaster, ...(PresentationMaster | undefined)[]];
  pageSize: Size;
  revisionId: string;
}

export interface AuthParams {
  redirectUrl?: string;
}

export interface AuthInputParams extends Record<string, unknown> {}

export interface AuthCallbackParams {
  provider: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  accessTokenType: string;
  refreshToken?: string;
}
