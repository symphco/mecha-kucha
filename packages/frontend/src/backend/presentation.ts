import {AppState, getImageLayouts} from '@/common';
import {CreatePresentationError, UnauthorizedError} from '@/backend/response';

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

interface Presentation {
  presentationId: string;
  slides: PresentationSlide[];
  layouts: PresentationLayout[];
  masters: [PresentationMaster, ...(PresentationMaster | undefined)[]];
  pageSize: Size;
  revisionId: string;
}

const handleCreateNewPresentation = (tokenType?: string, accessToken?: string) => {
  if (typeof tokenType === 'undefined') {
    throw new UnauthorizedError('User is not signed in'); // using provider (Google)
  }

  if (typeof accessToken === 'undefined') {
    throw new UnauthorizedError('User is not signed in'); // using provider (Google)
  }

  const authorization = [tokenType, accessToken].join(' ');
  return async (appState: AppState) => {
    // const template = await readFile('presentation-template.json', 'utf-8');
    // const templateBody = JSON.parse(template);

    const body = {
      title: `[MK-EXPORT ${Date.now()}] ${appState.title}`.trim(),
      // masters: templateBody.masters, // not used
      // layouts: templateBody.layouts, // not used
      // notesMaster: templateBody.notesMaster, // not used
    };

    const newPresentationResponse = await fetch(
      new URL(
        '/v1/presentations',
        'https://slides.googleapis.com'
      ).toString(),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    );

    const detail = await newPresentationResponse.json();
    if (!newPresentationResponse.ok) {
      if (newPresentationResponse.status === 401) {
        throw new UnauthorizedError('User is not signed in'); // using provider (Google)
      }
      throw new CreatePresentationError( 'Could not create new presentation on user\'s account', {
        cause: detail
      });
    }

    return detail;
  };
}

const handleAddPresentationSlides = (tokenType?: string, accessToken?: string) => {
  if (typeof tokenType === 'undefined') {
    throw new UnauthorizedError('User is not signed in'); // using provider (Google)
  }

  if (typeof accessToken === 'undefined') {
    throw new UnauthorizedError('User is not signed in'); // using provider (Google)
  }

  const authorization = [tokenType, accessToken].join(' ');

  return (appState: AppState) => {
    return async (newPresentation: Presentation) => {
      const updatedPresentation = await fetch(
        new URL(
          `/v1/presentations/${newPresentation.presentationId}:batchUpdate`,
          'https://slides.googleapis.com'
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
          `/v1/presentations/${newPresentation.presentationId}`,
          'https://slides.googleapis.com'
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

      return detail;
    };
  }
}

const handleAddPresentationSlideCaptions = (tokenType?: string, accessToken?: string) => {
  if (typeof tokenType === 'undefined') {
    throw new UnauthorizedError('User is not signed in'); // using provider (Google)
  }

  if (typeof accessToken === 'undefined') {
    throw new UnauthorizedError('User is not signed in'); // using provider (Google)
  }

  const authorization = [tokenType, accessToken].join(' ');

  return (appState: AppState) => {
    return async (presentationWithImages: Presentation) => {
      const presentationWithCaptionResponse = await fetch(
        new URL(
          `/v1/presentations/${presentationWithImages.presentationId}:batchUpdate`,
          'https://slides.googleapis.com'
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

      return presentationWithImages;
    };
  }
}

export const createNewPresentation = (tokenType?: string, accessToken?: string) => async (appState: AppState) => {
  const authParams = [tokenType, accessToken]
  const create = handleCreateNewPresentation(...authParams);
  const newPresentation = await create(appState);

  const addSlides = handleAddPresentationSlides(...authParams)(appState);
  const newPresentationWithImages = await addSlides(newPresentation);

  const addCaptions = handleAddPresentationSlideCaptions(...authParams)(appState);
  return addCaptions(newPresentationWithImages);
};
