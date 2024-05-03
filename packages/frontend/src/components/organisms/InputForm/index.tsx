import {ChangeEventHandler, FC, HTMLProps, useState} from 'react';
import {AppState} from '@symphco/mecha-kucha-common';
import {TextInput} from '@/components/molecules/TextInput';
import {MultilineTextInput} from '@/components/molecules/MultilineTextInput';
import {ActionButton} from '@/components/molecules/ActionButton';
import {DropdownInput} from '@/components/molecules/DropdownInput';
import {makeSlides, validateSlides} from '@/common';

interface InputFormProps extends HTMLProps<HTMLElementTagNameMap['form']> {
  defaultValues: AppState;
}

export const InputForm: FC<InputFormProps> = ({
  onSubmit,
  defaultValues,
  disabled,
  ...etcProps
}) => {
  const [isInspireMeDisabled, setIsInspireMeDisabled] = useState(true);

  const handleAnyInputChange = (form?: HTMLElementTagNameMap['form'] | null) => {
    if (!form) {
      return;
    }
    const formData = new FormData(form);
    const values = Object.fromEntries(
      formData.entries()
    ) as Record<string, string>;

    const { input, imageGenerator } = values;
    const slides = makeSlides(input, imageGenerator);
    try {
      validateSlides(slides)
    } catch {
      setIsInspireMeDisabled(true);
      return;
    }

    setIsInspireMeDisabled(values.title.trim().length < 1);
  };

  const handleTitleChange: ChangeEventHandler<HTMLElementTagNameMap['input']> = (e) => {
    handleAnyInputChange(e.currentTarget.form);
  };

  const handleInputChange: ChangeEventHandler<HTMLElementTagNameMap['textarea']> = (e) => {
    handleAnyInputChange(e.currentTarget.form);
  };

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
          <div className="flex flex-col gap-2">
            <p>
              Step 1: Give a title to your presentation.
            </p>
            <TextInput
              label="Title (required)"
              name="title"
              defaultValue={defaultValues?.title}
              required
              onChange={handleTitleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>
              Step 2: Follow the format for your input as follows:
            </p>
            <pre className="text-xs relative after:pointer-events-none after:absolute after:top-0 after:left-0 after:w-full after:h-full after:opacity-10 after:bg-current p-4">
              <code>
                Part 1: Slide Title<br />
                Theme: Nature<br />
                Slide notes for slide 1 here<br />
                <br />
                Part 2: Another Slide Title<br />
                Theme: Industry<br />
                Slide notes for slide 2 go here<br />
                <br />
                ...
              </code>
            </pre>
            <MultilineTextInput
              label="Input (required)"
              rows={5}
              name="input"
              defaultValue={defaultValues?.input}
              required
              onChange={handleInputChange}
              autoResize
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>
              Step 3: Select the image generator you want to use.
            </p>
            <DropdownInput
              label="Image Generator"
              name="imageGenerator"
              defaultValue={defaultValues?.imageGenerator}
            >
              <option value="picsum">
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
                  disabled={isInspireMeDisabled}
                >
                  Inspire Me!
                </ActionButton>
              </div>
              <div>
                <ActionButton
                  type="submit"
                  variant="primary"
                  disabled={isInspireMeDisabled}
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
