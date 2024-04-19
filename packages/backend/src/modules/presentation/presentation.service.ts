import {AppState, getImageLayouts} from '@symphco/mecha-kucha-common';
import {constants} from 'http2';
import {Presentation} from '../../models';
import * as config from '../../config';
import {CreatePresentationError, UnauthorizedError} from './presentation.response';

export interface PresentationService {
  createNewPresentation(appState: AppState): Promise<Presentation>;
}

export class PresentationServiceImpl implements PresentationService {
  private presentation?: Presentation;

  private appState?: AppState;

  constructor(private readonly accessTokenType: string, private readonly accessToken: string) {
    // noop
  }

  private async initializeNewPresentation() {
    if (typeof this.appState === 'undefined') {
      throw new CreatePresentationError('App state is undefined.');
    }
    const appState = this.appState;
    // const template = await readFile('presentation-template.json', 'utf-8');
    // const templateBody = JSON.parse(template);

    const body = {
      title: `[MK-EXPORT ${Date.now()}] ${appState.title}`.trim(),
      // masters: templateBody.masters, // not used
      // layouts: templateBody.layouts, // not used
      // notesMaster: templateBody.notesMaster, // not used
    };

    const authParams = [this.accessTokenType, this.accessToken];
    const authorization = authParams.join(' ');
    const newPresentationResponse = await fetch(
      new URL(
        config.content.googleSlides.presentationsEndpoint,
        config.content.googleSlides.baseUrl
      ).toString(),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const detail = await newPresentationResponse.json();
    if (!newPresentationResponse.ok) {
      if (newPresentationResponse.status === constants.HTTP_STATUS_UNAUTHORIZED) {
        throw new UnauthorizedError('User is not signed in'); // using provider (Google)
      }
      throw new CreatePresentationError('Could not create new presentation on user\'s account', {
        cause: detail,
      });
    }

    this.presentation = detail as Presentation;
  }

  private async addPresentationSlides() {
    if (typeof this.appState === 'undefined') {
      throw new CreatePresentationError('App state is undefined.');
    }
    if (typeof this.presentation === 'undefined') {
      throw new CreatePresentationError('Could not add slides to non-existing presentation.');
    }
    const appState = this.appState;
    const newPresentation = this.presentation;
    const authParams = [this.accessTokenType, this.accessToken];
    const authorization = authParams.join(' ');
    const updatedPresentation = await fetch(
      new URL(
        `${config.content.googleSlides.presentationsEndpoint}/${this.presentation.presentationId}:batchUpdate`,
        config.content.googleSlides.baseUrl,
      ).toString(),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            ...(newPresentation.slides.map((el) => {
              return {
                deleteObject: {
                  objectId: el.objectId
                }
              }
            })),
            ...(newPresentation.layouts.map((el) => {
              return {
                deleteObject: {
                  objectId: el.objectId
                }
              }
            })),
            ...(newPresentation.masters[0].pageElements.map((el) => {
              return {
                deleteObject: {
                  objectId: el.objectId
                }
              }
            })),
            ...(appState.slides?.map((s, slideIndex) => {
              const imageLayouts = getImageLayouts(s);

              return [
                {
                  createSlide: {
                    objectId: s.id
                  }
                },
                ...s.slots.slice(0, s.visibleSlots).flatMap((slot, i) => {
                  const createShape = {
                    createShape: {
                      objectId: `${s.id}:${i}`,
                      elementProperties: {
                        pageObjectId: s.id,
                        size: {
                          width: {
                            magnitude: newPresentation.pageSize.width.magnitude * imageLayouts[i].size.width,
                            unit: newPresentation.pageSize.width.unit,
                          },
                          height: {
                            magnitude: newPresentation.pageSize.height.magnitude * imageLayouts[i].size.height,
                            unit: newPresentation.pageSize.height.unit,
                          }
                        },
                        transform: {
                          scaleX: 1,
                          scaleY: 1,
                          shearX: 0,
                          shearY: 0,
                          translateX: newPresentation.pageSize.width.magnitude * imageLayouts[i].transform.translateX,
                          translateY: newPresentation.pageSize.height.magnitude * imageLayouts[i].transform.translateY,
                          unit: newPresentation.pageSize.width.unit,
                        },
                      },
                      shapeType: 'RECTANGLE',
                    }
                  };

                  if (slot?.type === 'text') {
                    return [
                      createShape,
                      {
                        updateShapeProperties: {
                          objectId: `${s.id}:${i}`,
                          shapeProperties: {
                            outline: {
                              outlineFill: {
                                solidFill: {
                                  color: {
                                    rgbColor: {
                                      red: 0,
                                      green: 0,
                                      blue: 0,
                                    },
                                  },
                                  alpha: 0,
                                }
                              },
                              weight: {
                                magnitude: 0,
                                unit: 'EMU',
                              },
                              propertyState: 'NOT_RENDERED',
                            },
                            contentAlignment: 'MIDDLE',
                          },
                          fields: 'outline,contentAlignment',
                        },
                      },
                      {
                        insertText: {
                          objectId: `${s.id}:${i}`,
                          text: slot.text,
                        },
                      },
                    ] as any;
                  }

                  if (slot?.type === 'image') {
                    return [
                      createShape,
                      {
                        updateShapeProperties: {
                          objectId: `${s.id}:${i}`,
                          shapeProperties: {
                            outline: {
                              outlineFill: {
                                solidFill: {
                                  color: {
                                    rgbColor: {
                                      red: 0,
                                      green: 0,
                                      blue: 0,
                                    },
                                  },
                                  alpha: 0,
                                }
                              },
                              weight: {
                                magnitude: 0,
                                unit: 'EMU',
                              },
                              propertyState: 'NOT_RENDERED',
                            }
                          },
                          fields: 'outline',
                        },
                      },
                      {
                        insertText: {
                          objectId: `${s.id}:${i}`,
                          text: `s${slideIndex}i${i}`,
                        },
                      },
                      {
                        replaceAllShapesWithImage: {
                          imageReplaceMethod: 'CENTER_CROP',
                          pageObjectIds: [
                            s.id,
                          ],
                          containsText: {
                            text: `s${slideIndex}i${i}`,
                            matchCase: false,
                          },
                          imageUrl: slot.url,
                        }
                      },
                    ];
                  }

                  return [];
                }),
              ];
            }) ?? []),
          ],
          writeControl: {
            requiredRevisionId: newPresentation.revisionId
          },
        })
      }
    );

    if (!updatedPresentation.ok) {
      const detail = await updatedPresentation.json();
      throw new CreatePresentationError('Could not add slides.', {
        cause: detail,
      });
    }

    const presentationWithImagesResponse = await fetch(
      new URL(
        `${config.content.googleSlides.presentationsEndpoint}/${newPresentation.presentationId}`,
        config.content.googleSlides.baseUrl,
      ).toString(),
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        },
      }
    )

    const detail = await presentationWithImagesResponse.json();
    if (!presentationWithImagesResponse.ok) {
      throw new CreatePresentationError('Could not get updated slides.', {
        cause: detail,
      })
    }

    this.presentation = detail as Presentation;
  }

  private async addPresentationSlideCaptions() {
    if (typeof this.appState === 'undefined') {
      throw new CreatePresentationError('App state is undefined.');
    }
    if (typeof this.presentation === 'undefined') {
      throw new CreatePresentationError('Could not add slide captions to non-existing presentation.');
    }
    const appState = this.appState;
    const presentationWithImages = this.presentation;
    const authParams = [this.accessTokenType, this.accessToken];
    const authorization = authParams.join(' ');
    const presentationWithCaptionResponse = await fetch(
      new URL(
        `${config.content.googleSlides.presentationsEndpoint}/${presentationWithImages.presentationId}:batchUpdate`,
        config.content.googleSlides.baseUrl,
      ).toString(),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: appState.slides?.map((s, i) => {
            return {
              insertText: {
                objectId: presentationWithImages.slides[i].slideProperties.notesPage.pageElements[1].objectId,
                text: s.text,
              }
            };
          }),
          writeControl: {
            requiredRevisionId: presentationWithImages.revisionId
          },
        })
      },
    );

    if (!presentationWithCaptionResponse.ok) {
      const detail = await presentationWithCaptionResponse.json();
      throw new CreatePresentationError('Could not add captions.', {
        cause: detail,
      });
    }
  }

  async createNewPresentation(appState: AppState): Promise<Presentation> {
    this.appState = appState;
    await this.initializeNewPresentation();
    await this.addPresentationSlides();
    await this.addPresentationSlideCaptions();
    return this.presentation as Presentation;
  }
}
