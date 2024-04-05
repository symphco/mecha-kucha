import {FC, FormEventHandler, ReactEventHandler} from 'react';
import {getImageLayouts, Slide} from '@/common';

export interface SlideDisplayProps {
  slide: Slide;
  imagesLoading?: number[];
  onImageLoad?: ReactEventHandler<HTMLElementTagNameMap['img']>;
  onAction?: FormEventHandler<HTMLElementTagNameMap['form']>;
  hasActions?: boolean;
}

export const SlideDisplay: FC<SlideDisplayProps> = ({
  slide,
  imagesLoading = [],
  onImageLoad,
  onAction,
  hasActions,
}) => {
  const layouts = getImageLayouts(slide);

  return (
    <div className="relative w-full h-full">
      {slide.slots.slice(0, slide.visibleSlots).map((slot, i) => (
        <div
          key={`${slot}:${i}`}
          className="absolute bg-black"
          style={{
            left: `${layouts[i].transform.translateX * 100}%`,
            top: `${layouts[i].transform.translateY * 100}%`,
            width: `${layouts[i].size.width * 100}%`,
            height: `${layouts[i].size.height * 100}%`,
          }}
        >
          {
            slot?.type === 'image'
            && (
              <div className={`w-full h-full ${imagesLoading.includes(i) ? 'opacity-50' : ''}`.trim()}>
                <div
                  className="w-full h-full"
                >
                  <img
                    className="w-full h-full object-center object-cover"
                    src={slot.url}
                    alt=""
                    onLoad={onImageLoad}
                  />
                </div>
              </div>
            )
          }
          {
            slot?.type === 'text'
            && (
              <div
                className="w-full h-full flex items-center justify-center"
              >
                {slot.text}
              </div>
            )
          }
          {hasActions && (
            <form
              aria-label="Slide Slot Form"
              className="absolute top-0 left-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center flex-wrap gap-4"
              onSubmit={onAction}
            >
              <fieldset
                className="contents"
                disabled={imagesLoading.includes(i)}
              >
                <legend
                  className="sr-only"
                >
                  Slide Slot Form
                </legend>
                <button
                  className="border-0 h-12 px-4"
                  type="submit"
                  name="action"
                  value="regenerate"
                >
                  Regenerate
                </button>
              </fieldset>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};
