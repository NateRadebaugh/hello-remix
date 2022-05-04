import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import clsx from "clsx";
import StandardFieldError from "~/components/standard-field-error";
import StandardFieldWrapper from "~/components/standard-field-wrapper";
import StandardTextInput from "~/components/standard-text-input";
import { authenticateSecurityUser } from "~/models/securityUser.server";
import { commitSession, getUserSession } from "~/session";
import type { ActionFunction, LoaderFunction } from "~/utils/types";
import { json, redirect } from "~/utils/types";

// TODO: remove fake timeout
function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

interface IFormData {
  email: string;
  password: string;
}

type ActionDataErrors = Record<keyof IFormData, string | undefined>;

interface ActionData {
  error?: string;
  errors: ActionDataErrors;
  values: IFormData;
}

export const action: ActionFunction<IFormData> = async ({ request }) => {
  const formData = await request.formData();
  const values: IFormData = {
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  };

  const errors: ActionDataErrors = {
    email: undefined,
    password: undefined,
  };

  if (!values.email) {
    errors.email = "Email is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  const hasErrors = Object.values(errors).filter(Boolean).length > 0;
  if (hasErrors) {
    return json({ errors, values }, { status: 422 });
  }

  const session = await getUserSession(request);

  const { securityUser, error } = await authenticateSecurityUser(session, {
    email: values.email,
    password: values.password,
  });
  if (error) {
    return json({ error, errors, values }, { status: 422 });
  }

  session.set("securityUser", securityUser);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader: LoaderFunction<null> = async ({ request }) => {
  const session = await getUserSession(request);

  if (session.has("securityUser")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/");
  }

  return json(null, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Login() {
  const transition = useTransition();
  const actionData = useActionData<ActionData>();

  return (
    <Form method="post">
      <h1 className="text-center">Log In</h1>
      <fieldset disabled={transition.state === "submitting"}>
        <StandardFieldWrapper label="Email:" error={actionData?.errors.email}>
          <StandardTextInput<IFormData>
            name="email"
            defaultValue={actionData?.values.email}
          />
        </StandardFieldWrapper>

        <StandardFieldWrapper
          label="Password:"
          error={actionData?.errors.password}
        >
          <StandardTextInput<IFormData>
            name="password"
            type="password"
            defaultValue={actionData?.values.password}
          />
        </StandardFieldWrapper>

        <StandardFieldError error={actionData?.error} />

        <div className="mb-3">
          <button type="submit" className="btn btn-primary w-100">
            {transition.state === "submitting" ? "Logging in..." : "Log in"}
          </button>
        </div>
        <div className="text-end">
          <Link to="/forgot-password">Forgot Password</Link>
        </div>
      </fieldset>
    </Form>
  );
}
