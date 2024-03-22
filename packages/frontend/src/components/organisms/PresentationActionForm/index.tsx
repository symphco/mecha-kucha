import {FC, HTMLProps} from 'react';
import {ActionButton} from '@/components/molecules/ActionButton';
import {AppState} from '@/common';

export interface PresentationActionFormProps extends HTMLProps<HTMLElementTagNameMap['form']> {
  defaultValues?: AppState;
}

export const PresentationActionForm: FC<PresentationActionFormProps> = ({
  defaultValues,
  ...etcProps
}) => {
  return (
    <form
      {...etcProps}
      aria-label="Presentation Action Form"
    >
      <fieldset className="contents">
        <legend className="sr-only">Presentation Actions</legend>
        <input
          type="hidden"
          name="title"
          defaultValue={defaultValues?.title}
        />
        <input
          type="hidden"
          name="input"
          defaultValue={defaultValues?.input}
        />
        {(defaultValues?.slides ?? []).map((slide) => (
          <input
            key={slide.id}
            type="hidden"
            name="slides"
            defaultValue={JSON.stringify(slide)}
          />
        ))}
        <div className="flex gap-4 items-center">
          <div>
            <ActionButton
              type="submit"
              variant="default"
              name="action"
              value="download:application/json"
            >
              <span className="flex flex-col leading-none items-start">
                <span>
                  Download
                </span>
                {' '}
                <span className="text-xs">
                  JSON
                </span>
              </span>
            </ActionButton>
          </div>
          <div>
            <ActionButton
              type="submit"
              variant="primary"
              name="action"
              value="save"
            >
              Save
            </ActionButton>
          </div>
        </div>
      </fieldset>
    </form>
  )
};
