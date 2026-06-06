import React, { forwardRef } from 'react';

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-white text-slate-900 border ${
              error ? 'border-danger focus:ring-danger/20' : 'border-slate-200 focus:border-primary focus:ring-primary/20'
            } rounded-lg ${
              leftIcon ? 'pl-11 pr-4' : 'px-4'
            } py-2.5 text-sm transition-all focus:outline-none focus:ring-4 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <span className="text-xs font-medium text-danger">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-slate-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-white text-slate-900 border ${
            error ? 'border-danger focus:ring-danger/20' : 'border-slate-200 focus:border-primary focus:ring-primary/20'
          } rounded-lg px-4 py-2.5 text-sm min-h-[100px] transition-all focus:outline-none focus:ring-4 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400 ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs font-medium text-danger">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-slate-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// Select Component
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase select-none">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-white text-slate-900 border ${
            error ? 'border-danger focus:ring-danger/20' : 'border-slate-200 focus:border-primary focus:ring-primary/20'
          } rounded-lg px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-4 disabled:bg-slate-50 disabled:text-slate-400 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:0.7em_auto] bg-[position:right_16px_center] bg-no-repeat pr-10 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="text-xs font-medium text-danger">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-slate-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Select.displayName = 'Select';

// Checkbox Component
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="inline-flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            ref={ref}
            className={`w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary focus:ring-offset-0 focus:outline-none transition ${className}`}
            {...props}
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 select-none">
            {label}
          </span>
        </label>
        {error && <span className="text-xs font-medium text-danger">{error}</span>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
