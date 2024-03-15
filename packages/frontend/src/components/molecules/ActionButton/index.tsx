import * as React from 'react';

const ActionButtonDerivedElementComponent = 'button' as const;

export type ActionButtonDerivedElement = HTMLElementTagNameMap[typeof ActionButtonDerivedElementComponent];

export interface ActionButtonProps extends Omit<
  React.HTMLProps<ActionButtonDerivedElement>,
  'type'
> {
  type?: 'button' | 'reset' | 'submit';
  variant?: 'super' | 'primary' | 'default';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  className,
  variant = 'default',
  ...etcProps
}) => {
  return (
    <ActionButtonDerivedElementComponent
      {...etcProps}
      className={
        `h-12 rounded overflow-hidden px-8 font-bold disabled:opacity-50 ${
          variant === 'primary'
          && 'border-2 border-white bg-white text-black'
        } ${
          variant === 'super'
          && 'bg-gradient-super text-black'
        } ${
          variant === 'default'
          && 'border-2 border-white text-white'
        } ${className}`
      }
    >
      {children}
    </ActionButtonDerivedElementComponent>
  );
};

ActionButton.displayName = 'ActionButton';
