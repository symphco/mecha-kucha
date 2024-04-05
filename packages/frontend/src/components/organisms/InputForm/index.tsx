import {FC, HTMLProps} from 'react';
import {AppState} from '@/common';
import {TextInput} from '@/components/molecules/TextInput';
import {MultilineTextInput} from '@/components/molecules/MultilineTextInput';
import {ActionButton} from '@/components/molecules/ActionButton';
import {DropdownInput} from '@/components/molecules/DropdownInput';

interface InputFormProps extends HTMLProps<HTMLElementTagNameMap['form']> {
  defaultValues: AppState;
}

export const InputForm: FC<InputFormProps> = ({
  onSubmit,
  defaultValues,
  disabled,
  ...etcProps
}) => {
  return (
    <form
      {...etcProps}
      onSubmit={onSubmit}
      aria-label="Input Form"
    >
      <fieldset className="contents" disabled={disabled}>
        <legend className="sr-only">
          Input Form
        </legend>
        <div className="flex flex-col gap-8">
          <div>
            <TextInput
              label="Title"
              name="title"
              defaultValue={defaultValues?.title}
            />
          </div>
          <div>
            <MultilineTextInput
              label="Input"
              rows={3}
              name="input"
              defaultValue={defaultValues?.input}
            />
          </div>
          <div>
            <DropdownInput
              label="Image Generator"
              name="imageGenerator"
              defaultValue={defaultValues?.imageGenerator}
            >
              <option value="">
                Picsum
              </option>
              <option value="unsplash">
                Unsplash
              </option>
            </DropdownInput>
          </div>
          <div className="flex justify-between items-center gap-8">
            <div>
              <ActionButton
                type="reset"
              >
                Cancel
              </ActionButton>
            </div>
            <div className="flex justify-end gap-8">
              <div>
                <ActionButton
                  type="submit"
                  name="submit"
                  value="inspire-me"
                  variant="super"
                >
                  Inspire Me!
                </ActionButton>
              </div>
              <div>
                <ActionButton
                  type="submit"
                  variant="primary"
                >
                  Go!
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
};
