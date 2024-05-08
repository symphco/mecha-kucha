import {ChangeEventHandler, FC, HTMLProps, useState} from 'react';
import {
  AppState,
  AVAILABLE_IMAGE_SOURCES,
  AVAILABLE_CAPTION_SOURCES,
  AVAILABLE_DESTINATIONS,
} from '@symphco/mecha-kucha-common';
import {TextInput} from '@/components/molecules/TextInput';
import {MultilineTextInput} from '@/components/molecules/MultilineTextInput';
import {ActionButton} from '@/components/molecules/ActionButton';
import {DropdownInput} from '@/components/molecules/DropdownInput';

interface InputFormProps extends HTMLProps<HTMLElementTagNameMap['form']> {
  defaultValues: AppState;
  isInspireMeButtonDisabled?: boolean;
  isGoButtonDisabled?: boolean;
  handleAnyInputChange?: (form: HTMLElementTagNameMap['form'] | null) => void;
  hasCancel?: boolean;
}

export const InputForm: FC<InputFormProps> = ({
  onSubmit,
  defaultValues,
  disabled,
  isInspireMeButtonDisabled = true,
  isGoButtonDisabled = true,
  handleAnyInputChange,
  hasCancel = true,
  ...etcProps
}) => {

  const handleTitleChange: ChangeEventHandler<HTMLElementTagNameMap['input']> = (e) => {
    handleAnyInputChange?.(e.currentTarget.form);
  };

  const handleInputChange: ChangeEventHandler<HTMLElementTagNameMap['textarea']> = (e) => {
    handleAnyInputChange?.(e.currentTarget.form);
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
            <p>
              Note: you might need to change the input yourself after generation.
            </p>
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
              Step 3: Select the parameters you want to apply.
            </p>
            <div className="contents sm:flex gap-2">
              <DropdownInput
                label="Image Generator"
                name="imageGenerator"
                className="w-full"
                defaultValue={defaultValues?.imageGenerator}
              >
                {Object
                  .entries(AVAILABLE_IMAGE_SOURCES)
                  .sort(([, sourceA], [, sourceB]) => sourceA.name.localeCompare(sourceB.name))
                  .map(([key, source]) => (
                    <option value={key} key={key}>
                      {source.name}
                    </option>
                  ))
                }
              </DropdownInput>
              <DropdownInput
                label="Caption Generator"
                name="captionGenerator"
                className="w-full"
                defaultValue={defaultValues?.captionGenerator}
              >
                {
                  Object
                    .entries(AVAILABLE_CAPTION_SOURCES)
                    .sort(([, sourceA], [, sourceB]) => sourceA.name.localeCompare(sourceB.name))
                    .map(([key, source]) => (
                      <option value={key} key={key}>
                        {source.name}
                      </option>
                    ))
                }
              </DropdownInput>
              <DropdownInput
                label="Destination"
                name="destination"
                className="w-full"
                defaultValue={defaultValues?.destination}
              >
                {
                  Object
                    .entries(AVAILABLE_DESTINATIONS)
                    .sort(([, sourceA], [, sourceB]) => sourceA.name.localeCompare(sourceB.name))
                    .map(([key, destination]) => (
                      <option value={key} key={key}>
                        {destination.name}
                      </option>
                    ))
                }
              </DropdownInput>
            </div>
          </div>
          <div className="flex justify-between items-center gap-8">
            <div>
              {hasCancel && (
                <ActionButton
                  type="reset"
                >
                  Cancel
                </ActionButton>
              )}
            </div>
            <div className="flex justify-end gap-8">
              <div>
                <ActionButton
                  type="submit"
                  name="submit"
                  value="inspire-me"
                  variant="super"
                  disabled={isInspireMeButtonDisabled}
                  formNoValidate
                >
                  {disabled ? 'Inspiring...' : 'Inspire Me!'}
                </ActionButton>
              </div>
              <div>
                <ActionButton
                  type="submit"
                  variant="primary"
                  disabled={isGoButtonDisabled}
                >
                  {disabled ? 'Please wait...' : 'Go!'}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
};
