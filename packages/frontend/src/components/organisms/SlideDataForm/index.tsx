import {DropdownInput} from '@/components/molecules/DropdownInput';
import {ChangeEventHandler, FC, HTMLProps} from 'react';
import {MAXIMUM_IMAGES, Slide, SLIDE_LAYOUTS} from '@/common';
import {NumberInput} from '@/components/molecules/NumberInput';
import {MultilineTextInput} from '@/components/molecules/MultilineTextInput';
import {TextInput} from '@/components/molecules/TextInput';
import {ActionButton} from '@/components/molecules/ActionButton';

export interface SlideDataFormProps extends HTMLProps<HTMLElementTagNameMap['form']> {
  defaultValues?: Slide;
  onFieldChange?: ChangeEventHandler<
    HTMLElementTagNameMap['select']
    | HTMLElementTagNameMap['input']
    | HTMLElementTagNameMap['textarea']
  >;
}

export const SlideDataForm: FC<SlideDataFormProps> = ({
  defaultValues: currentSlide,
  onFieldChange,
  ...etcProps
}) => {
  return (
    <form
      {...etcProps}
      aria-label="Slide Data Form"
    >
      <fieldset className="contents">
        <legend className="sr-only">Slide Data</legend>
        <input
          type="hidden"
          name="id"
          defaultValue={currentSlide?.id}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <TextInput
              label="Title"
              name="title"
              defaultValue={currentSlide?.title}
              onChange={onFieldChange as ChangeEventHandler<HTMLElementTagNameMap['input']>}
            />
          </div>
          <div>
            <TextInput
              label="Theme"
              name="theme"
              defaultValue={currentSlide?.theme}
              onChange={onFieldChange as ChangeEventHandler<HTMLElementTagNameMap['input']>}
              disabled
            />
          </div>
          <div>
            <DropdownInput
              label="Layout"
              name="layout"
              defaultValue={currentSlide?.layout}
              onChange={onFieldChange as ChangeEventHandler<HTMLElementTagNameMap['select']>}
            >
              {SLIDE_LAYOUTS.map((l) => (
                <option
                  key={l}
                  value={l}
                >
                  {l}
                </option>
              ))}
            </DropdownInput>
          </div>
          <div className="flex gap-4">
            <div className="flex-auto">
              <NumberInput
                label="Images"
                name="visibleImages"
                defaultValue={currentSlide?.visibleImages}
                onChange={onFieldChange as ChangeEventHandler<HTMLElementTagNameMap['input']>}
                min={0}
                max={MAXIMUM_IMAGES}
              />
            </div>
            <div>
              <ActionButton
                type="submit"
                name="action"
                value="regenerate"
              >
                Regenerate All
              </ActionButton>
            </div>
          </div>
          <div className="col-span-2">
            <MultilineTextInput
              label="Caption"
              name="text"
              defaultValue={currentSlide?.text}
              rows={3}
              onChange={onFieldChange as ChangeEventHandler<HTMLElementTagNameMap['textarea']>}
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
};
