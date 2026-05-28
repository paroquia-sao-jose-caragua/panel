'use client';

import { FieldDescription } from '@/components/ui/field';
import { createContext, useContext, type ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type RootProps = ComponentProps<'div'> & {
  error?: string;
  helperText?: string;
  touched?: boolean;
};

type InputContextType = {
  showError: boolean;
};

const InputContext = createContext({
  showError: false,
} as InputContextType);

export const Root = ({ error, touched, helperText, ...props }: RootProps) => {
  const showError = Boolean(error && touched);

  return (
    <InputContext.Provider value={{ showError }}>
      <div>
        <div
          className={twMerge(
            'flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 bg-white',
            'focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-100',
            ...(showError ? ['border-red-700'] : ['border-input']),
            props.className
          )}
          {...props}
        />
        {showError && (
          <p
            className={twMerge(
              'mt-2 ml-4 text-xs',
              ...(error ? ['text-red-700'] : ['text-brand-600']),
              props.className
            )}
            {...props}
          >
            {error}
          </p>
        )}
        {!showError && helperText && (
          <div className="mt-2">
            <FieldDescription>{helperText}</FieldDescription>
          </div>
        )}
      </div>
    </InputContext.Provider>
  );
};

type ControlProps = ComponentProps<'input'>;

export const Control = ({ onBlur, type, ...props }: ControlProps) => {
  const { showError } = useContext(InputContext);

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    if (type === 'number') {
      const value = event.target.value;

      if (value) {
        // Remove zeros à esquerda
        event.target.value = String(Number(value));
      }
    }

    onBlur?.(event);
  };

  return (
    <input
      type={type}
      onBlur={handleBlur}
      className={twMerge([
        `${showError ? 'focus-error' : ''} flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none`,
      ])}
      {...props}
    />
  );
};

type PrefixProps = ComponentProps<'div'>;

export const Prefix = (props: PrefixProps) => {
  return <div {...props} />;
};
