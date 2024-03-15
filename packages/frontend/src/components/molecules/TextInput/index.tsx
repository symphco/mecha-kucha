import * as React from 'react';

const TextInputDerivedElementComponent = 'input' as const;

export type TextInputDerivedElement = HTMLElementTagNameMap[typeof TextInputDerivedElementComponent];

export interface TextInputProps extends Omit<
  React.HTMLProps<TextInputDerivedElement>,
  'label' | 'list' | 'type' | 'checked'
> {
  label?: React.ReactNode;
  type?: 'text' | 'search';
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  className,
  children,
  ...etcProps
}) => {
  const defaultId = React.useId();
  const effectiveId = id ?? defaultId;
  const listId = `${effectiveId}-list`

  return (
    <>
      {children && <datalist
        id={listId}
      >
        {children}
      </datalist>}
      <div className="bg-black h-12 relative rounded overflow-hidden has-[:disabled]:opacity-50">
        <label className="contents">
          <span className="absolute top-0 left-0 px-2 pt-1 w-full text-xs font-bold">
            {label}
          </span>
          <span
            className="border-2 rounded w-full h-full absolute top-0 left-0 pointer-events-none"
          />
          <TextInputDerivedElementComponent
            {...etcProps}
            id={effectiveId}
            className={`bg-black h-full w-full block px-2 pt-2 ${className}`}
            list={children ? listId : undefined}
          />
        </label>
      </div>
    </>
  );
};

TextInput.displayName = 'TextInput';
