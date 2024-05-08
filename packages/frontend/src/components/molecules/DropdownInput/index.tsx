import * as React from 'react';

const DropdownInputDerivedElementComponent = 'select' as const;

export type DropdownInputDerivedElement = HTMLElementTagNameMap[typeof DropdownInputDerivedElementComponent];

export interface DropdownInputProps extends Omit<
  React.HTMLProps<DropdownInputDerivedElement>,
  'label' | 'list' | 'type' | 'checked'
> {
  label?: React.ReactNode;
  type?: 'text' | 'search';
}

export const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  id,
  className,
  children,
  ...etcProps
}) => {
  const defaultId = React.useId();
  const effectiveId = id ?? defaultId;

  return (
    <div className={`bg-black h-12 relative rounded overflow-hidden has-[:disabled]:opacity-50 ${className}`}>
      <label className="contents">
        <span className="absolute top-0 left-0 px-2 pt-1 w-full text-xs font-bold">
          {label}
        </span>
        <span
          className="border-2 rounded w-full h-full absolute top-0 left-0 pointer-events-none"
        />
        <DropdownInputDerivedElementComponent
          {...etcProps}
          id={effectiveId}
          className={"bg-black h-full w-full block px-2 pt-2"}
        >
          {children}
        </DropdownInputDerivedElementComponent>
      </label>
    </div>
  );
};

DropdownInput.displayName = 'DropdownInput';
