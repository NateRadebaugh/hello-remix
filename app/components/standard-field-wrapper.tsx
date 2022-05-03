import { useTransition } from "@remix-run/react";
import clsx from "clsx";
import StandardFieldError from "./standard-field-error";

export interface StandardFieldWrapperProps<TFormData>
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function StandardFieldWrapper<TFormData>(
  props: StandardFieldWrapperProps<TFormData>
) {
  const transition = useTransition();
  const {
    label,
    required,
    disabled,
    error,
    children,
    className: rawClassName,
  } = props;

  const className = clsx([
    "d-block",
    rawClassName,
    transition.state === "idle" && error && "border-danger",
  ]);

  return (
    <div className="mb-3">
      <label className={className}>
        {label}{" "}
        {required && !disabled && <span className="text-danger">*</span>}
        <br />
        {children}
      </label>
      <StandardFieldError error={error} />
    </div>
  );
}
