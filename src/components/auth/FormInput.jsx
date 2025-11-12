import { forwardRef } from 'react';

const FormInput = forwardRef(({ 
  id, 
  label, 
  type = 'text', 
  placeholder = '', 
  error,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        className={`w-full px-4 py-2.5 bg-slate-800 border ${
          error ? 'border-red-500' : 'border-slate-700 focus:border-primary/50'
        } rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition`}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
