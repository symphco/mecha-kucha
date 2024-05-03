import * as React from 'react';
import {ChangeEventHandler} from 'react';

const MultilineTextInputDerivedElementComponent = 'textarea' as const;

export type MultilineTextInputDerivedElement = HTMLElementTagNameMap[typeof MultilineTextInputDerivedElementComponent];

export interface MultilineTextInputProps extends Omit<
  React.HTMLProps<MultilineTextInputDerivedElement>,
  'label' | 'list' | 'type' | 'checked'
> {
  label?: React.ReactNode;
  type?: 'text' | 'search';
  autoResize?: boolean;
}

export const MultilineTextInput: React.FC<MultilineTextInputProps> = ({
  label,
  id,
  className,
  children,
  autoResize = false,
  onChange,
  rows: defaultRows = 1,
  ...etcProps
}) => {
  const defaultId = React.useId();
  const effectiveId = id ?? defaultId;
  const [isClient, setIsClient] = React.useState(false);

  const handleChange: ChangeEventHandler<MultilineTextInputDerivedElement> = (e) => {
    const {value} = e.currentTarget;
    if (autoResize) {
      e.currentTarget.rows = Math.max(defaultRows, value.split('\n').length);
    }
    onChange?.(e);
  };

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-black min-h-12 relative rounded overflow-hidden has-[:disabled]:opacity-50">
      <label className="contents">
        <span className="absolute top-0 left-0 px-2 pt-1 w-full text-xs font-bold">
          {label}
        </span>
        <span
          className="border-2 rounded w-full h-full absolute top-0 left-0 pointer-events-none"
        />
        <MultilineTextInputDerivedElementComponent
          {...etcProps}
          id={effectiveId}
          className={`bg-black h-full w-full block px-2 min-h-12 pt-4 ${className} ${autoResize && isClient ? 'resize-none' : 'resize-y'}`}
          onChange={handleChange}
          rows={defaultRows}
        />
      </label>
    </div>
  );
};

MultilineTextInput.displayName = 'MultilineTextInput';
