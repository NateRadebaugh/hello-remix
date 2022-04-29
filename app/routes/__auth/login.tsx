import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import clsx from "clsx";
import { authenticateSecurityUser } from "~/models/securityUser.server";
import { commitSession, getUserSession } from "~/session";

// TODO: remove fake timeout
function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

interface ActionDataValues {
  email: string;
  password: string;
}

type ActionDataErrors = Record<keyof ActionDataValues, string | undefined>;

interface ActionData {
  error?: string;
  errors: ActionDataErrors;
  values: ActionDataValues;
}

function ValidationMessage({
  error,
  isSubmitting,
}: {
  error: string | undefined;
  isSubmitting: boolean;
}) {
  if (!error) {
    return null;
  }

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

export const action: ActionFunction = async ({ request }) => {
  await sleep(1_000);
  const formData = await request.formData();
  const values = Object.fromEntries(formData) as unknown as ActionDataValues;

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
    return json<ActionData>({ errors, values }, { status: 422 });
  }

  const session = await getUserSession(request);

  const { securityUser, error } = await authenticateSecurityUser(session, {
    email: values.email,
    password: values.password,
  });
  if (error) {
    return json<ActionData>({ error, errors, values }, { status: 422 });
  }

  session.set("securityUser", securityUser);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
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
    <>
      <h1 className="text-center">Log In</h1>
      <Form method="post">
        <fieldset disabled={transition.state === "submitting"}>
          <div className="mb-3">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="text"
              className={clsx([
                "form-control",
                transition.state === "idle" &&
                  actionData?.errors.email &&
                  "border-danger",
              ])}
              defaultValue={actionData?.values.email}
            />
            {actionData?.errors.email && (
              <ValidationMessage
                isSubmitting={transition.state === "submitting"}
                error={actionData.errors.email}
              />
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              className={clsx([
                "form-control",
                transition.state === "idle" &&
                  actionData?.errors.password &&
                  "border-danger",
              ])}
              defaultValue={actionData?.values.password}
            />
            {actionData?.errors.password && (
              <ValidationMessage
                isSubmitting={transition.state === "submitting"}
                error={actionData.errors.password}
              />
            )}
          </div>

          <ValidationMessage
            isSubmitting={transition.state === "submitting"}
            error={actionData?.error}
          />

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
    </>
  );
}
