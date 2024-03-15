import * as React from 'react';

const NumberInputDerivedElementComponent = 'input' as const;

export type NumberInputDerivedElement = HTMLElementTagNameMap[typeof NumberInputDerivedElementComponent];

export interface NumberInputProps extends Omit<
  React.HTMLProps<NumberInputDerivedElement>,
  'label' | 'list' | 'type' | 'checked' | 'children'
> {
  label?: React.ReactNode;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  id,
  className,
  ...etcProps
}) => {
  const defaultId = React.useId();
  const effectiveId = id ?? defaultId;

  return (
    <div className="bg-black h-12 relative rounded overflow-hidden has-[:disabled]:opacity-50">
      <label className="contents">
        <span className="absolute top-0 left-0 px-2 pt-1 w-full text-xs font-bold">
          {label}
        </span>
        <span
          className="border-2 rounded w-full h-full absolute top-0 left-0 pointer-events-none"
        />
        <NumberInputDerivedElementComponent
          {...etcProps}
          id={effectiveId}
          type="number"
          className={`bg-black h-full w-full block px-2 pt-2 ${className}`}
        />
      </label>
    </div>
  );
};

NumberInput.displayName = 'NumberInput';
