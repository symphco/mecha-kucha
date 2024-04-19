export interface BaseSlotContent {
  type: string;
}

export interface ImageSlotContent extends BaseSlotContent {
  type: 'image';
  url: string;
}

export interface TextSlotContent extends BaseSlotContent {
  type: 'text';
  text: string;
}

export type SlotContent = ImageSlotContent | TextSlotContent;

export type SlotCollection = [SlotContent?, SlotContent?, SlotContent?, SlotContent?, SlotContent?];

export const SLIDE_LAYOUTS = ['vertical-bars', 'horizontal-bars', 'grid-left', 'grid-right'] as const;

export type SlideLayout = typeof SLIDE_LAYOUTS[number];

export interface Slide {
  id: string;
  title: string;
  theme: string;
  layout: SlideLayout;
  visibleSlots: number;
  text: string;
  slots: SlotCollection;
  color?: string;
}

export interface AppState {
  title?: string;
  input?: string;
  slides?: Slide[];
  imageGenerator?: string;
}

export const MAXIMUM_IMAGES = 5 as const;

interface ImageSize {
  width: number;
  height: number;
}

interface ImageTransform {
  translateX: number;
  translateY: number;
}

export interface SlideImageLayout {
  size: ImageSize;
  transform: ImageTransform;
}

const getHorizontalBarsLayout = (slide: Slide): SlideImageLayout[] => (
  slide.slots.slice(0, slide.visibleSlots).map((_, i) => ({
    size: {
      width: 1,
      height: 1.0 / slide.visibleSlots
    },
    transform: {
      translateX: 0,
      translateY: 1.0 / slide.visibleSlots * i
    },
  }))
);

const getVerticalBarsLayout = (slide: Slide): SlideImageLayout[] => (
  slide.slots.slice(0, slide.visibleSlots).map((_, i) => ({
    size: {
      width: 1.0 / slide.visibleSlots,
      height: 1,
    },
    transform: {
      translateX: 1.0 / slide.visibleSlots * i,
      translateY: 0,
    },
  }))
);

const getGridLeftLayout = (slide: Slide): SlideImageLayout[] => {
  if (slide.visibleSlots < 3) {
    return getVerticalBarsLayout(slide);
  }

  if (slide.visibleSlots === 3) {
    return slide.slots.slice(0, slide.visibleSlots).map((_, i) => {
      if (i < slide.visibleSlots - 1) {
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

  if (slide.visibleSlots === 4) {
    return slide.slots.slice(0, slide.visibleSlots).map((_, i) => ({
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

  return slide.slots.slice(0, slide.visibleSlots).map((_, i) => {
    if (i < slide.visibleSlots - 2) {
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
        translateY: (slide.visibleSlots - 1 - i) * 0.5,
      },
    };
  });
};

const getGridRightLayout = (slide: Slide): SlideImageLayout[] => {
  if (slide.visibleSlots < 3) {
    return getVerticalBarsLayout(slide);
  }
  if (slide.visibleSlots === 3) {
    return slide.slots.slice(0, slide.visibleSlots).map((_, i) => {
      if (i < slide.visibleSlots - 1) {
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

  if (slide.visibleSlots === 4) {
    return slide.slots.slice(0, slide.visibleSlots).map((_, i) => ({
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

  return slide.slots.slice(0, slide.visibleSlots).map((_, i) => {
    if (i < slide.visibleSlots - 2) {
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
        translateY: (slide.visibleSlots - 1 - i) * 0.5,
      },
    };
  });
};

export const getImageLayouts = (slide: Slide): SlideImageLayout[] => {
  if (slide.visibleSlots === 0) {
    return [];
  }

  if (slide.visibleSlots === 1) {
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
    return getHorizontalBarsLayout(slide);
  case 'vertical-bars':
    return getVerticalBarsLayout(slide);
  case 'grid-left':
    return getGridLeftLayout(slide);
  case 'grid-right':
    return getGridRightLayout(slide);
  default:
    break;
  }

  throw new Error(`Unknown layout "${slide.layout}"`);
};
