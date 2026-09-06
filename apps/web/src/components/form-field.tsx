type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
};

type InputProps = BaseProps & {
  kind?: 'input';
  type?: string;
  defaultValue?: string;
};

type TextareaProps = BaseProps & {
  kind: 'textarea';
  rows?: number;
};

type SelectProps = BaseProps & {
  kind: 'select';
  options: string[];
  defaultValue?: string;
};

export type FormFieldProps = InputProps | TextareaProps | SelectProps;

const controlStyles =
  'rounded-xl border border-white/[.09] bg-[#090909] px-4 py-3.5 text-[#F2EFE7] outline-none transition focus:border-[#C8A96B]/60';

export function FormField(props: FormFieldProps) {
  if (props.kind === 'textarea') {
    const { label, name, required, placeholder, rows = 5 } = props;
    return (
      <label className="grid gap-2 text-sm text-[#A5A098]">
        {label}
        <textarea
          required={required}
          name={name}
          rows={rows}
          placeholder={placeholder}
          className={`${controlStyles} resize-none`}
        />
      </label>
    );
  }

  if (props.kind === 'select') {
    const { label, name, required, options, defaultValue } = props;
    return (
      <label className="grid gap-2 text-sm text-[#A5A098]">
        {label}
        <select
          required={required}
          name={name}
          defaultValue={defaultValue}
          className={controlStyles}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  const { label, name, required, placeholder, type, defaultValue } = props;
  return (
    <label className="grid gap-2 text-sm text-[#A5A098]">
      {label}
      <input
        required={required}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={controlStyles}
      />
    </label>
  );
}
