import clsx from "clsx";

export interface StandardCheckboxProps<TFormData>
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "type" | "name"
  > {
  name: Extract<keyof TFormData, string>;
}

export default function StandardCheckbox<TFormData>({
  name,
  className,
  ...props
}: StandardCheckboxProps<TFormData>) {
  return (
    <input type="checkbox" name={name} className={clsx(className)} {...props} />
  );
}
