import {FC, MouseEventHandler, ReactEventHandler} from 'react';
import {Slide} from '@/common';

export interface SlideDisplayProps {
  slide: Slide;
  imagesLoading?: number[];
  onImageLoad?: ReactEventHandler<HTMLElementTagNameMap['img']>;
  onImageRegenerate?: MouseEventHandler<HTMLElementTagNameMap['button']>;
  hasRegenerate?: boolean;
}

export const SlideDisplay: FC<SlideDisplayProps> = ({
  slide,
  imagesLoading = [],
  onImageLoad,
  onImageRegenerate,
  hasRegenerate,
}) => {
  return (
    <>
      {slide.layout === 'vertical-bars' && Array.isArray(slide.imageUrls) && (
        <div className="flex h-full w-full">
          {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
            <div
              key={`${url}:${i}`}
              className="h-full w-0 flex-auto relative"
            >
              <img
                className={`w-full h-full object-center object-cover ${imagesLoading.includes(i) ? 'opacity-50' : ''}`.trim()}
                src={url}
                alt=""
                onLoad={onImageLoad}
              />
              {hasRegenerate && (
                <button
                  className="absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 border-0"
                  type="button"
                  disabled={imagesLoading.includes(i)}
                  onClick={onImageRegenerate}
                >
                  Regenerate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {slide.layout === 'horizontal-bars' && Array.isArray(slide.imageUrls) && (
        <div className="flex-col flex h-full w-full">
          {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
            <div
              key={`${url}:${i}`}
              className="h-0 w-full flex-auto relative"
            >
              <img
                className={`w-full h-full object-center object-cover ${imagesLoading.includes(i)
                  ? 'opacity-50'
                  : ''}`.trim()}
                src={url}
                alt=""
                onLoad={onImageLoad}
              />
              {hasRegenerate && (
                <button
                  className="absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 border-0"
                  type="button"
                  disabled={imagesLoading.includes(i)}
                  onClick={onImageRegenerate}
                >
                  Regenerate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {slide.layout === 'grid-left' && Array.isArray(slide.imageUrls) && (
        <div className="relative w-full h-full">
          <div className="grid grid-cols-2 absolute top-0 left-0 w-full h-full auto-rows-fr">
            {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
              <div
                key={`${url}:${i}`}
                className="relative only:col-span-2 [&:nth-child(4):not(:last-child)]:col-start-1 [&:nth-child(4):not(:last-child)]:row-start-4 [&:nth-child(4):not(:last-child)]:row-span-3 [&:nth-child(5)]:last:row-span-3 odd:last:row-span-4 row-span-2 odd:last:order-1 order-2 h-full"
              >
                <img
                  className={`w-full h-full object-center object-cover ${imagesLoading.includes(i)
                    ? 'opacity-50'
                    : ''}`.trim()}
                  src={url}
                  alt=""
                  onLoad={onImageLoad}
                />
                {hasRegenerate && (
                  <button
                    className="absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 border-0"
                    type="button"
                    disabled={imagesLoading.includes(i)}
                    onClick={onImageRegenerate}
                  >
                    Regenerate
                  </button>
                )}
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
                key={`${url}:${i}`}
                className="relative only:col-span-2 [&:nth-child(4):not(:last-child)]:col-start-2 [&:nth-child(4):not(:last-child)]:row-start-4 [&:nth-child(4):not(:last-child)]:row-span-3 [&:nth-child(5)]:last:col-start-2 [&:nth-child(5)]:last:row-start-1 [&:nth-child(5)]:last:row-span-3 odd:last:row-span-4 row-span-2 [&:not(:first-child)]odd:last:col-start-2 odd:last:row-start-1 odd:last:order-2 order-1 h-full"
              >
                <img
                  className={`w-full h-full object-center object-cover ${imagesLoading.includes(i)
                    ? 'opacity-50'
                    : ''}`.trim()}
                  src={url}
                  alt=""
                  onLoad={onImageLoad}
                />
                {hasRegenerate && (
                  <button
                    className="absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 border-0"
                    type="button"
                    disabled={imagesLoading.includes(i)}
                    onClick={onImageRegenerate}
                  >
                    Regenerate
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
