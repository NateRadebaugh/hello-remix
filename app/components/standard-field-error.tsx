import { useTransition } from "@remix-run/react";
import clsx from "clsx";

export interface StandardFieldErrorProps {
  error: string | undefined;
}

export default function StandardFieldError({ error }: StandardFieldErrorProps) {
  const transition = useTransition();

  if (!error) {
    return null;
  }

  const isSubmitting = transition.state === "submitting";

  return (
    <div
      className={clsx([
        "form-text",
        isSubmitting ? "text-muted" : "text-danger",
      ])}
    >
      {error}
    </div>
  );
}
