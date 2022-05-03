import { useTransition } from "@remix-run/react";
import clsx from "clsx";
import StandardFieldError from "./standard-field-error";

export type StandardTextInputProps<TFormData> = (
  | (Omit<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      "id" | "type" | "name"
    > & {
      type?: "password";
      name: Extract<keyof TFormData, string>;
    })
  | (Omit<
      React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >,
      "id" | "name"
    > & {
      name: Extract<keyof TFormData, string>;
      rows: number;
    })
);

export default function StandardTextInput<TFormData>(
  props: StandardTextInputProps<TFormData>
) {
  const { name, className: rawClassName, ...rest } = props;

  const className = clsx([
    "form-control",
    rawClassName,
  ]);

  return (
    <>
      {"rows" in rest ? (
        <textarea name={name} className={className} {...rest} />
      ) : (
        <input
          type={rest.type ?? "text"}
          name={name}
          className={className}
          {...rest}
        />
      )}
    </>
  );
}
