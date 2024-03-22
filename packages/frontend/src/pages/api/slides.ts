import type {NextApiHandler} from "next";
import {AppState, Slide} from '@/common';
// import {readFile} from 'fs/promises'

// perhaps we could use this one for previews too? then we define new layouts here
const getImageLayouts = (slide: Slide) => {
  if (slide.visibleImages === 0) {
    return [];
  }

  if (slide.visibleImages === 1) {
    return [
      {
        size: {
          width: 1,
          height: 1,
        },
        transform: {
          translateX: 0,
          translateY: 0
        }
      }
    ];
  }

  switch (slide.layout) {
  case 'horizontal-bars':
    return slide.imageUrls.slice(0, slide.visibleImages).map((_, i) => ({
      size: {
        width: 1,
        height: 1.0 / slide.visibleImages
      },
      transform: {
        translateX: 0,
        translateY: 1.0 / slide.visibleImages * i
      },
    }));
  case 'vertical-bars':
    return slide.imageUrls.slice(0, slide.visibleImages).map((_, i) => ({
      size: {
        width: 1.0 / slide.visibleImages,
        height: 1,
      },
      transform: {
        translateX: 1.0 / slide.visibleImages * i,
        translateY: 0,
      },
    }));
  case 'grid-left':
    if (slide.visibleImages < 3) {
      return getImageLayouts({
        ...slide,
        layout: 'vertical-bars'
      });
    }
    if (slide.visibleImages === 3) {
      return slide.imageUrls.slice(0, slide.visibleImages).map((_, i) => {
        if (i < slide.visibleImages - 1) {
          return {
            size: {
              width: 0.5,
              height: 0.5,
            },
            transform: {
              translateX: 0.5,
              translateY: 0.5 * (i % 2)
            },
          };
        }

        return {
          size: {
            width: 0.5,
            height: 1,
          },
          transform: {
            translateX: 0,
            translateY: 0,
          }
        };
      })
    }

    if (slide.visibleImages === 4) {
      return slide.imageUrls.slice(0, slide.visibleImages).map((_, i) => ({
        size: {
          width: 0.5,
          height: 0.5,
        },
        transform: {
          translateX: 0.5 * (i % 2),
          translateY: i < 2 ? 0 : 0.5
        },
      }))
    }

    return slide.imageUrls.slice(0, slide.visibleImages).map((_, i) => {
      if (i < slide.visibleImages - 2) {
        return {
          size: {
            width: 0.5,
            height: 1.0 / 3.0,
          },
          transform: {
            translateX: 0.5,
            translateY: (1.0 / 3.0) * i
          },
        };
      }

      return {
        size: {
          width: 0.5,
          height: 0.5,
        },
        transform: {
          translateX: 0,
          translateY: (slide.visibleImages - 1 - i) * 0.5,
        },
      };
    });
  case 'grid-right':
    if (slide.visibleImages < 3) {
      return getImageLayouts({
        ...slide,
        layout: 'vertical-bars'
      });
    }
    if (slide.visibleImages === 3) {
      return slide.imageUrls.slice(0, slide.visibleImages).map((_, i) => {
        if (i < slide.visibleImages - 1) {
          return {
            size: {
              width: 0.5,
              height: 0.5,
            },
            transform: {
              translateX: 0,
              translateY: 0.5 * (i % 2)
            },
          };
        }

        return {
          size: {
            width: 0.5,
            height: 1,
          },
          transform: {
            translateX: 0.5,
            translateY: 0,
          }
        };
      })
    }

    if (slide.visibleImages === 4) {
      return slide.imageUrls.slice(0, slide.visibleImages).map((_, i) => ({
        size: {
          width: 0.5,
          height: 0.5,
        },
        transform: {
          translateX: 0.5 * (i % 2),
          translateY: i < 2 ? 0 : 0.5
        },
      }))
    }

    return slide.imageUrls.slice(0, slide.visibleImages).map((_, i) => {
      if (i < slide.visibleImages - 2) {
        return {
          size: {
            width: 0.5,
            height: 1.0 / 3.0,
          },
          transform: {
            translateX: 0,
            translateY: (1.0 / 3.0) * i
          },
        };
      }

      return {
        size: {
          width: 0.5,
          height: 0.5,
        },
        transform: {
          translateX: 0.5,
          translateY: (slide.visibleImages - 1 - i) * 0.5,
        },
      };
    });
  }
};

const handler: NextApiHandler = async (req, res) => {
  const appState = req.body as AppState;
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
        'Accept': req.headers.accept ?? 'application/json',
        'Authorization': [req.cookies.tokenType, req.cookies.accessToken].join(' '),
        'Content-Type': req.headers['content-type'] ?? 'application/json',
      },
      body: JSON.stringify(body)
    }
  );

  if (!newPresentationResponse.ok) {
    console.error(await newPresentationResponse.json());
    res.status(502).send({
      message: 'Error'
    });
    return;
  }

  const newPresentation = await newPresentationResponse.json();
  const updatedPresentation = await fetch(
    new URL(
      `/v1/presentations/${newPresentation.presentationId}:batchUpdate`,
      'https://slides.googleapis.com'
    ).toString(),
    {
      method: 'POST',
      headers: {
        'Accept': req.headers.accept ?? 'application/json',
        'Authorization': [req.cookies.tokenType, req.cookies.accessToken].join(' '),
        'Content-Type': req.headers['content-type'] ?? 'application/json',
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
              ...s.imageUrls.slice(0, s.visibleImages).flatMap((imageUrl, i) => {
                return [
                  {
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
                  },
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
                      imageUrl,
                    }
                  },
                ];
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
    console.error(await updatedPresentation.json());
    res.status(502).send({
      message: 'Error'
    });
    return;
  }

  const presentationWithImagesResponse = await fetch(
    new URL(
      `/v1/presentations/${newPresentation.presentationId}`,
      'https://slides.googleapis.com'
    ).toString(),
    {
      method: 'GET',
      headers: {
        'Accept': req.headers.accept ?? 'application/json',
        'Authorization': [req.cookies.tokenType, req.cookies.accessToken].join(' '),
      },
    }
  )

  if (!presentationWithImagesResponse.ok) {
    console.error(await presentationWithImagesResponse.json());
    res.status(502).send({
      message: 'Error'
    });
    return;
  }

  const presentationWithImages = await presentationWithImagesResponse.json();
  const presentationWithCaptionResponse = await fetch(
    new URL(
      `/v1/presentations/${presentationWithImages.presentationId}:batchUpdate`,
      'https://slides.googleapis.com'
    ).toString(),
    {
      method: 'POST',
      headers: {
        'Accept': req.headers.accept ?? 'application/json',
        'Authorization': [req.cookies.tokenType, req.cookies.accessToken].join(' '),
        'Content-Type': req.headers['content-type'] ?? 'application/json',
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
    console.error(await presentationWithCaptionResponse.json());
    res.status(502).send({
      message: 'Error'
    });
    return;
  }

  res.json(newPresentation);

  // TODO error handling!
  // TODO add slide captions when there are no images
  // TODO user to be able to select which image generator to use
  // TODO upload your own image/source code?
  // TODO proper sign-in screen for Google
  return;
};

export default handler;
