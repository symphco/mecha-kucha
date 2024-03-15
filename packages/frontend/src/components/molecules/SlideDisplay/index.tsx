import {FC} from 'react';
import {Slide} from '@/common';

export interface SlideDisplayProps {
  slide: Slide;
}

export const SlideDisplay: FC<SlideDisplayProps> = ({
  slide
}) => {
  return (
    <>
      {slide.layout === 'vertical-bars' && Array.isArray(slide.imageUrls) && (
        <div className="flex h-full w-full">
          {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
            <div
              key={i}
              className="h-full w-0 flex-auto"
            >
              <img
                className="w-full h-full object-center object-cover"
                src={url}
              />
            </div>
          ))}
        </div>
      )}
      {slide.layout === 'horizontal-bars' && Array.isArray(slide.imageUrls) && (
        <div className="flex-col flex h-full w-full">
          {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
            <div
              key={i}
              className="h-0 w-full flex-auto"
            >
              <img
                className="w-full h-full object-center object-cover"
                src={url}
              />
            </div>
          ))}
        </div>
      )}
      {slide.layout === 'grid-left' && Array.isArray(slide.imageUrls) && (
        <div className="relative w-full h-full">
          <div className="grid grid-cols-2 absolute top-0 left-0 w-full h-full auto-rows-fr">
            {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
              <div
                key={i}
                className="only:col-span-2 [&:nth-child(4):not(:last-child)]:col-start-1 [&:nth-child(4):not(:last-child)]:row-start-4 [&:nth-child(4):not(:last-child)]:row-span-3 [&:nth-child(5)]:last:row-span-3 odd:last:row-span-4 row-span-2 odd:last:order-1 order-2 h-full"
              >
                <img
                  className="w-full h-full object-center object-cover"
                  src={url}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {slide.layout === 'grid-right' && Array.isArray(slide.imageUrls) && (
        <div className="relative w-full h-full">
          <div className="grid grid-cols-2 absolute top-0 left-0 w-full h-full auto-rows-fr">
            {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
              <div
                key={i}
                className="only:col-span-2 [&:nth-child(4):not(:last-child)]:col-start-2 [&:nth-child(4):not(:last-child)]:row-start-4 [&:nth-child(4):not(:last-child)]:row-span-3 [&:nth-child(5)]:last:col-start-2 [&:nth-child(5)]:last:row-start-1 [&:nth-child(5)]:last:row-span-3 odd:last:row-span-4 row-span-2 [&:not(:first-child)]odd:last:col-start-2 odd:last:row-start-1 odd:last:order-2 order-1 h-full"
              >
                <img
                  className="w-full h-full object-center object-cover"
                  src={url}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
