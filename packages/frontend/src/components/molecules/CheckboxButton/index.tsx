import * as React from 'react';

const CheckboxButtonDerivedElementComponent = 'input' as const;

export type CheckboxButtonDerivedElement = HTMLElementTagNameMap[typeof CheckboxButtonDerivedElementComponent];

export interface CheckboxButtonProps extends Omit<
  React.HTMLProps<CheckboxButtonDerivedElement>,
  'label' | 'list' | 'type'
> {
  label?: React.ReactNode;
  type?: 'text' | 'search';
}

export const CheckboxButton: React.FC<CheckboxButtonProps> = ({
  className,
  children,
  ...etcProps
}) => {
  return (
    <label
      className={`whitespace-nowrap flex items-center gap-4 h-12 border-2 rounded overflow-hidden pl-4 pr-8 font-bold has-[:disabled]:opacity-50 ${className}`.trim()}
    >
      <CheckboxButtonDerivedElementComponent
        {...etcProps}
        type="checkbox"
        className="sr-only peer"
      />
      <span
        className="w-6 h-6 border-2 rounded overflow-hidden flex items-center justify-center peer-checked:after:content-['✓']"
      />
      <span>
        {children}
      </span>
    </label>
  )
};

CheckboxButton.displayName = 'CheckboxButton';
