import {MAXIMUM_IMAGES, Slide, SLIDE_LAYOUTS} from '@symphco/mecha-kucha-common';

export const makeSlides = (input: string, imageGenerator: string): Partial<Slide>[] => {
  return input
    .split('\n')
    .filter((s) => s.trim().length > 0)
    .reduce(
      (previousSlides, line) => {
        if (line.startsWith('Part ')) {
          const [, partTitle = ''] = line.split(':');
          const title = partTitle.trim();

          return [
            ...previousSlides,
            {
              id: window.crypto.randomUUID(),
              imageGenerator,
              layout: SLIDE_LAYOUTS[Math.floor(Math.random() * SLIDE_LAYOUTS.length)],
              visibleSlots: Math.floor(Math.random() * (MAXIMUM_IMAGES + 1)),
              title,
              text: '',
            } as Partial<Slide>
          ];
        }

        if (line.startsWith('Theme:')) {
          const [, query] = line.split(':');
          const theme = query.trim();
          const lastSlide = previousSlides.at(-1);
          if (typeof lastSlide === 'undefined') {
            return previousSlides;
          }
          return [
            ...previousSlides.slice(0, -1),
            {
              ...lastSlide,
              theme,
            }
          ] as Slide[];
        }

        const lastSlide = previousSlides.at(-1);
        if (typeof lastSlide === 'undefined') {
          return previousSlides;
        }
        return [
          ...previousSlides.slice(0, -1),
          {
            ...lastSlide,
            text: `${lastSlide.text}\n\n${line.trim()}`.trim()
          }
        ];
      },
      [] as Partial<Slide>[]
    );
};

export const validateSlides = (theSlides: Partial<Slide>[]) => {
  if (theSlides.length < 1) {
    throw new Error('No slides');
  }

  const incompleteSlides = theSlides.filter((slide) => (
    typeof slide.title === 'undefined'
    || typeof slide.theme === 'undefined'
  ));

  if (incompleteSlides.length > 0) {
    throw new Error('Incomplete slides', {
      cause: incompleteSlides
    });
  }

  const emptySlides = theSlides.filter((slide) => (
    (slide.title?.trim().length ?? 0) < 1
    || (slide.theme?.trim().length ?? 0) < 1
  ));

  if (emptySlides.length > 0) {
    throw new Error('Incomplete slides', {
      cause: emptySlides
    });
  }
};
